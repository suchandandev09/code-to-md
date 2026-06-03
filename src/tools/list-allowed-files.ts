// list-allowed-files.ts: Lists files using localized per-directory config merging.
import fs from "node:fs";
import path from "node:path";

import {
	type ConvertConfig,
	getConfigForDirectory,
	getLocalConfigForDirectory,
	mergeConfigs,
} from "../config";

function isAllowedForConfig(inputPath: string, config: ConvertConfig): boolean {
	const extension = path.extname(inputPath).toLowerCase();
	return config.allowedExtensions.includes(extension);
}

function walkDirectory(dirPath: string, config: ConvertConfig, files: string[]): void {
	const localConfig = getLocalConfigForDirectory(dirPath);
	const scopedConfig = localConfig ? mergeConfigs(config, localConfig) : config;
	const entries = fs.readdirSync(dirPath, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);

		if (entry.isDirectory()) {
			if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "dist") {
				continue;
			}

			walkDirectory(fullPath, scopedConfig, files);
			continue;
		}

		if (entry.isFile() && isAllowedForConfig(fullPath, scopedConfig)) {
			files.push(fullPath);
		}
	}
}

export function listAllowedFilesInCurrentDirectory(): string[] {
	const cwd = process.cwd();
	const files: string[] = [];
	const baseConfig = getConfigForDirectory(cwd);

	walkDirectory(cwd, baseConfig, files);

	return files
		.map((filePath) => path.relative(cwd, filePath))
		.sort((a, b) => a.localeCompare(b));
}
