import fs from "node:fs";
import path from "node:path";

import { isAllowedInputExtension } from "../config";

function walkDirectory(dirPath: string, files: string[]): void {
	const entries = fs.readdirSync(dirPath, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);

		if (entry.isDirectory()) {
			if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "dist") {
				continue;
			}

			walkDirectory(fullPath, files);
			continue;
		}

		if (entry.isFile() && isAllowedInputExtension(fullPath)) {
			files.push(fullPath);
		}
	}
}

export function listAllowedFilesInCurrentDirectory(): string[] {
	const cwd = process.cwd();
	const files: string[] = [];

	walkDirectory(cwd, files);

	return files
		.map((filePath) => path.relative(cwd, filePath))
		.sort((a, b) => a.localeCompare(b));
}
