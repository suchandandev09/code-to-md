import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

function runCli(args: string[]) {
	const cliEntryPath = path.resolve(process.cwd(), "src/main.ts");

	return spawnSync("npx", ["tsx", cliEntryPath, ...args], {
		encoding: "utf8",
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
