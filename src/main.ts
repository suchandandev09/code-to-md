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

if (argv.includes("--help") || argv.includes("-h")) {
	printHelp();
	process.exit(0);
}

if (argv.length === 0) {
	processCurrentDirectory();
	process.exit(0);
}

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

const inputFile = argv[0];
const formatIndex = argv.indexOf("--format");
const formatArg = formatIndex >= 0 ? argv[formatIndex + 1] : undefined;

if (!isAllowedInputExtension(inputFile)) {
	const allowed = getAllowedExtensions().join(", ");
	printError(`Input file extension is not allowed. Allowed extensions: ${allowed}`);
	process.exit(1);
}

if (formatArg !== undefined && formatArg !== "md" && formatArg !== "mdx") {
	printError("Invalid value for --format. Expected 'md' or 'mdx'.");
	process.exit(1);
}

const result = convertReactToMarkdown(inputFile, { format: formatArg as "md" | "mdx" | undefined });
printInfo("Phase 1 placeholder run.");
for (const warning of result.warnings) {
	printWarning(warning);
}
