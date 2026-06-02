import { printBanner, printInfo, printSection } from "./cli-message-system";

// Prints CLI help content in a structured message format.
export function printHelp(): void {
	printBanner("code-to-md");
	printSection("Usage:", ["code-to-md <input-file> [--format md|mdx]", "code-to-md --list"]);
	printSection("Examples:", [
		"code-to-md ./Component.tsx",
		"code-to-md ./Component.tsx --format mdx",
		"code-to-md --list",
	]);
	printInfo("Phase 1 placeholder: conversion engine will be added in a later phase.");
}
