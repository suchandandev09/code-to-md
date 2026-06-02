#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const config_1 = require("./config");
const tools_1 = require("./tools");
const argv = process.argv.slice(2);
function printHelp() {
    (0, tools_1.printBanner)("code-to-md");
    (0, tools_1.printSection)("Usage:", ["code-to-md <input-file> [--format md|mdx]", "code-to-md --list"]);
    (0, tools_1.printSection)("Examples:", [
        "code-to-md ./Component.tsx",
        "code-to-md ./Component.tsx --format mdx",
        "code-to-md --list",
    ]);
    (0, tools_1.printInfo)("Phase 1 placeholder: conversion engine will be added in a later phase.");
}
if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    process.exit(0);
}
if (argv.includes("--list")) {
    const files = (0, tools_1.listAllowedFilesInCurrentDirectory)();
    if (files.length === 0) {
        const allowed = (0, config_1.getAllowedExtensions)().join(", ");
        (0, tools_1.printInfo)(`No files found with the allowed extensions: ${allowed}`);
        process.exit(0);
    }
    (0, tools_1.printSuccess)("Files with allowed extensions:");
    for (const file of files) {
        (0, tools_1.printInfo)(file);
    }
    process.exit(0);
}
const inputFile = argv[0];
const formatIndex = argv.indexOf("--format");
const formatArg = formatIndex >= 0 ? argv[formatIndex + 1] : undefined;
if (!(0, config_1.isAllowedInputExtension)(inputFile)) {
    const allowed = (0, config_1.getAllowedExtensions)().join(", ");
    (0, tools_1.printError)(`Input file extension is not allowed. Allowed extensions: ${allowed}`);
    process.exit(1);
}
if (formatArg !== undefined && formatArg !== "md" && formatArg !== "mdx") {
    (0, tools_1.printError)("Invalid value for --format. Expected 'md' or 'mdx'.");
    process.exit(1);
}
const result = (0, index_1.convertReactToMarkdown)(inputFile, { format: formatArg });
(0, tools_1.printInfo)("Phase 1 placeholder run.");
for (const warning of result.warnings) {
    (0, tools_1.printWarning)(warning);
}
//# sourceMappingURL=main.js.map