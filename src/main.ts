#!/usr/bin/env node

import { convertReactToMarkdown } from "./index";
import { getAllowedExtensions, isAllowedInputExtension } from "./config";
import {
	listAllowedFilesInCurrentDirectory,
	printError,
	printHelp,
	printInfo,
	processCurrentDirectory,
	printSuccess,
	printWarning,
} from "./tools";

const argv = process.argv.slice(2);

// Show usage details only when explicit help flags are provided.
if (argv.includes("--help") || argv.includes("-h")) {
	printHelp();
	process.exit(0);
}

// With no arguments, process the current directory using configured extensions.
if (argv.length === 0) {
	processCurrentDirectory();
	process.exit(0);
}

// List mode: print all files in the current directory tree that match allowed extensions.
if (argv.includes("--list")) {
	const files = listAllowedFilesInCurrentDirectory();
	if (files.length === 0) {
		const allowed = getAllowedExtensions().join(", ");
		printInfo(`No files found with the allowed extensions: ${allowed}`);
		process.exit(0);
	}

	printSuccess("Files with allowed extensions:");
	for (const file of files) {
		printInfo(file);
	}

	process.exit(0);
}

// Parse positional input path and optional output format flag.
const inputFile = argv[0];
const formatIndex = argv.indexOf("--format");
const formatArg = formatIndex >= 0 ? argv[formatIndex + 1] : undefined;

// Block unsupported input types before invoking conversion.
if (!isAllowedInputExtension(inputFile)) {
	const allowed = getAllowedExtensions().join(", ");
	printError(`Input file extension is not allowed. Allowed extensions: ${allowed}`);
	process.exit(1);
}

// Validate format argument to keep CLI behavior explicit and predictable.
if (formatArg !== undefined && formatArg !== "md" && formatArg !== "mdx") {
	printError("Invalid value for --format. Expected 'md' or 'mdx'.");
	process.exit(1);
}

// Execute conversion and emit placeholder warnings from the current conversion engine.
const result = convertReactToMarkdown(inputFile, { format: formatArg as "md" | "mdx" | undefined });
printInfo("Phase 1 placeholder run.");
for (const warning of result.warnings) {
	printWarning(warning);
}
