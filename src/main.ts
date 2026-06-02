#!/usr/bin/env node

import { convertReactToMarkdown } from "./index";
import { getAllowedExtensions, isAllowedInputExtension } from "./config";

const argv = process.argv.slice(2);

function printHelp(): void {
	console.log(`react-markdown

Usage:
	react-markdown <input-file> [--format md|mdx]

Examples:
	react-markdown ./Component.tsx
	react-markdown ./Component.tsx --format mdx

Note:
	Phase 1 wires the package and CLI entry point only.
	File conversion will be implemented in a later phase.`);
}

if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
	printHelp();
	process.exit(0);
}

const inputFile = argv[0];
const formatIndex = argv.indexOf("--format");
const formatArg = formatIndex >= 0 ? argv[formatIndex + 1] : undefined;

if (!isAllowedInputExtension(inputFile)) {
	const allowed = getAllowedExtensions().join(", ");
	console.error(`Input file extension is not allowed. Allowed extensions: ${allowed}`);
	process.exit(1);
}

if (formatArg !== undefined && formatArg !== "md" && formatArg !== "mdx") {
	console.error("Invalid value for --format. Expected 'md' or 'mdx'.");
	process.exit(1);
}

const result = convertReactToMarkdown(inputFile, { format: formatArg as "md" | "mdx" | undefined });
console.log("Phase 1 placeholder run.");
for (const warning of result.warnings) {
	console.warn(`Warning: ${warning}`);
}
