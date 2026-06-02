import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

function runCli(args: string[], cwd = process.cwd()) {
	const cliEntryPath = path.resolve(process.cwd(), "src/main.ts");

	return spawnSync("npx", ["tsx", cliEntryPath, ...args], {
		encoding: "utf8",
		cwd,
	});
}

test("prints help output", () => {
	const result = runCli(["--help"]);

	assert.equal(result.status, 0);
	assert.match(result.stdout, /Usage:/);
});

test("fails on invalid --format value", () => {
	const result = runCli(["./Component.tsx", "--format", "txt"]);

	assert.equal(result.status, 1);
	assert.match(result.stderr, /Invalid value for --format/);
});

test("fails on unsupported input extension", () => {
	const result = runCli(["./Component.md", "--format", "mdx"]);

	assert.equal(result.status, 1);
	assert.match(result.stderr, /Input file extension is not allowed/);
	assert.match(result.stderr, /\.tsx/);
	assert.match(result.stderr, /\.jsx/);
});

test("lists files with allowed extensions in current directory", () => {
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-to-md-"));
	const nestedDir = path.join(tempDir, "nested");
	fs.mkdirSync(nestedDir);
	fs.writeFileSync(
		path.join(tempDir, "code-to-md.config.json"),
		JSON.stringify({ allowedExtensions: [".tsx", ".jsx"] }),
		"utf8",
	);
	fs.writeFileSync(path.join(tempDir, "A.tsx"), "export const A = 1;", "utf8");
	fs.writeFileSync(path.join(nestedDir, "B.jsx"), "export default function B() { return null; }", "utf8");
	fs.writeFileSync(path.join(nestedDir, "C.ts"), "export const C = 1;", "utf8");

	const result = runCli(["--list"], tempDir);

	assert.equal(result.status, 0);
	assert.match(result.stdout, /Files with allowed extensions:/);
	assert.match(result.stdout, /A\.tsx/);
	assert.match(result.stdout, /nested[\\/]B\.jsx/);
	assert.doesNotMatch(result.stdout, /C\.ts/);

	fs.rmSync(tempDir, { recursive: true, force: true });
});

test("shows no-files message with allowed extensions when no match is found", () => {
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-to-md-"));
	fs.writeFileSync(
		path.join(tempDir, "code-to-md.config.json"),
		JSON.stringify({ allowedExtensions: [".tsx", ".jsx"] }),
		"utf8",
	);
	fs.writeFileSync(path.join(tempDir, "README.md"), "not a react file", "utf8");

	const result = runCli(["--list"], tempDir);

	assert.equal(result.status, 0);
	assert.match(result.stdout, /No files found with the allowed extensions:/);
	assert.match(result.stdout, /\.tsx/);
	assert.match(result.stdout, /\.jsx/);

	fs.rmSync(tempDir, { recursive: true, force: true });
});

test("processes current directory when no args are provided", () => {
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-to-md-"));
	fs.writeFileSync(
		path.join(tempDir, "code-to-md.config.json"),
		JSON.stringify({ allowedExtensions: [".tsx", ".jsx"] }),
		"utf8",
	);
	fs.writeFileSync(path.join(tempDir, "Component.tsx"), "export const A = 1;", "utf8");

	const result = runCli([], tempDir);

	assert.equal(result.status, 0);
	assert.match(result.stdout, /Processing 1 file\(s\) with allowed extensions:/);
	assert.match(result.stdout, /Processing: Component\.tsx/);
	assert.doesNotMatch(result.stdout, /Usage:/);

	fs.rmSync(tempDir, { recursive: true, force: true });
});
