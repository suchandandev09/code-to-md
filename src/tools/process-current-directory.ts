import { getAllowedExtensions } from "../config";
import { convertReactToMarkdown } from "./convert-to-markdown";
import { listAllowedFilesInCurrentDirectory } from "./list-allowed-files";
import { printInfo, printSuccess, printWarning } from "./cli-message-system";

// Processes all files in the current directory that match configured extensions.
export function processCurrentDirectory(): void {
	const files = listAllowedFilesInCurrentDirectory();

	if (files.length === 0) {
		const allowed = getAllowedExtensions().join(", ");
		printInfo(`No files found with the allowed extensions: ${allowed}`);
		return;
	}

	printSuccess(`Processing ${files.length} file(s) with allowed extensions:`);

	for (const file of files) {
		printInfo(`Processing: ${file}`);
		const result = convertReactToMarkdown(file);
		for (const warning of result.warnings) {
			printWarning(`[${file}] ${warning}`);
		}
	}
}
