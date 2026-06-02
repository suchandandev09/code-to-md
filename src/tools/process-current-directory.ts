import { getAllowedExtensions } from "../config";
import { convertReactToMarkdown } from "./convert-to-markdown";
import { listAllowedFilesInCurrentDirectory } from "./list-allowed-files";
import {
	printDetail,
	printInfo,
	printSection,
	printSpacer,
	printSuccess,
	printWarning,
} from "./cli-message-system";

// Processes all files in the current directory that match configured extensions.
export function processCurrentDirectory(): void {
	const files = listAllowedFilesInCurrentDirectory();

	if (files.length === 0) {
		const allowed = getAllowedExtensions().join(", ");
		printInfo(`No files found with the allowed extensions: ${allowed}`);
		return;
	}

	printSuccess(`Processing ${files.length} file(s) with allowed extensions:`);
	printDetail(`Allowed extensions: ${getAllowedExtensions().join(", ")}`);

	for (const [index, file] of files.entries()) {
		printSpacer();
		printSection(`File ${index + 1}/${files.length}:`, [file]);
		printInfo("Running conversion...");
		const result = convertReactToMarkdown(file);
		if (result.warnings.length === 0) {
			printSuccess("No warnings.");
			continue;
		}

		for (const warning of result.warnings) {
			printWarning(`${file}: ${warning}`);
		}
	}
}
