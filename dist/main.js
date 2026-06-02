#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const argv = process.argv.slice(2);
function printHelp() {
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
if (formatArg !== undefined && formatArg !== "md" && formatArg !== "mdx") {
    console.error("Invalid value for --format. Expected 'md' or 'mdx'.");
    process.exit(1);
}
const result = (0, index_1.convertReactToMarkdown)(inputFile, { format: formatArg });
console.log("Phase 1 placeholder run.");
for (const warning of result.warnings) {
    console.warn(`Warning: ${warning}`);
}
//# sourceMappingURL=main.js.map