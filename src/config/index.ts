// index.ts: Resolves global and localized configuration for CLI processing.
import path from "node:path";
import fs from "node:fs";

export interface ConvertConfig {
	allowedExtensions: string[];
}

export interface AllowedExtensionsDirective {
	extensions: string[];
	merge: boolean;
}

interface ConfigFilePayload {
	allowedExtensions?: string[] | {
		extensions?: string[];
		merge?: boolean;
	};
}

export const DEFAULT_CONFIG: ConvertConfig = {
	allowedExtensions: [".tsx", ".jsx"],
};

const CONFIG_FILE_NAME = "code2md.config.json";

function normalizeExtensions(extensions: string[] | undefined, fallback: string[]): string[] {
	if (!extensions || extensions.length === 0) {
		return [...fallback];
	}

	return extensions.map((extension) => {
		const normalized = extension.trim().toLowerCase();
		return normalized.startsWith(".") ? normalized : `.${normalized}`;
	});
}

function parseAllowedExtensionsDirective(payload: ConfigFilePayload): AllowedExtensionsDirective | null {
	const allowedExtensions = payload.allowedExtensions;

	if (Array.isArray(allowedExtensions)) {
		const extensions = normalizeExtensions(allowedExtensions, []);
		if (extensions.length === 0) {
			return null;
		}

		return {
			extensions,
			merge: false,
		};
	}

	if (!allowedExtensions || Array.isArray(allowedExtensions)) {
		return null;
	}

	const extensions = normalizeExtensions(allowedExtensions.extensions, []);
	if (extensions.length === 0) {
		return null;
	}

	return {
		extensions,
		merge: Boolean(allowedExtensions.merge),
	};
}

function applyAllowedExtensionsDirective(
	baseExtensions: string[],
	directive: AllowedExtensionsDirective,
): string[] {
	if (!directive.merge) {
		return directive.extensions;
	}

	return mergeAllowedExtensions(baseExtensions, directive.extensions);
}

function mergeAllowedExtensions(base: string[], local: string[] | undefined): string[] {
	if (!local || local.length === 0) {
		return base;
	}

	const merged = [...base];
	for (const extension of local) {
		if (!merged.includes(extension)) {
			merged.push(extension);
		}
	}

	return merged;
}

function parseConfigFile(configFilePath: string): ConfigFilePayload | null {
	try {
		const raw = fs.readFileSync(configFilePath, "utf8");
		return JSON.parse(raw) as ConfigFilePayload;
	} catch {
		return null;
	}
}

function getDirectoryHierarchy(targetDir: string): string[] {
	const hierarchy: string[] = [];
	let currentDir = path.resolve(targetDir);

	for (;;) {
		hierarchy.push(currentDir);
		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) {
			break;
		}
		currentDir = parentDir;
	}

	return hierarchy.reverse();
}

export function getConfigForDirectory(targetDir: string): ConvertConfig {
	const directories = getDirectoryHierarchy(targetDir);
	let hasExplicitConfig = false;
	let config: ConvertConfig = {
		allowedExtensions: [...DEFAULT_CONFIG.allowedExtensions],
	};

	for (const directory of directories) {
		const configFilePath = path.join(directory, CONFIG_FILE_NAME);
		if (!fs.existsSync(configFilePath)) {
			continue;
		}

		const parsed = parseConfigFile(configFilePath);
		if (!parsed) {
			continue;
		}

		const directive = parseAllowedExtensionsDirective(parsed);
		if (!directive) {
			continue;
		}

		if (!hasExplicitConfig) {
			hasExplicitConfig = true;
			config = {
				allowedExtensions: applyAllowedExtensionsDirective(config.allowedExtensions, directive),
			};
			continue;
		}

		config = {
			allowedExtensions: applyAllowedExtensionsDirective(config.allowedExtensions, directive),
		};
	}

	return config;
}

export function getLocalConfigForDirectory(targetDir: string): AllowedExtensionsDirective | null {
	const configFilePath = path.join(path.resolve(targetDir), CONFIG_FILE_NAME);
	if (!fs.existsSync(configFilePath)) {
		return null;
	}

	const parsed = parseConfigFile(configFilePath);
	if (!parsed) {
		return null;
	}

	return parseAllowedExtensionsDirective(parsed);
}

export function mergeConfigs(
	baseConfig: ConvertConfig,
	localConfig: AllowedExtensionsDirective,
): ConvertConfig {
	return {
		allowedExtensions: applyAllowedExtensionsDirective(baseConfig.allowedExtensions, localConfig),
	};
}

export function getConfig(): ConvertConfig {
	return getConfigForDirectory(process.cwd());
}

export function getAllowedExtensions(): string[] {
	return getConfig().allowedExtensions;
}

export function isAllowedInputExtension(inputPath: string): boolean {
	const absoluteInputPath = path.resolve(process.cwd(), inputPath);
	const effectiveConfig = getConfigForDirectory(path.dirname(absoluteInputPath));
	const extension = path.extname(inputPath).toLowerCase();
	return effectiveConfig.allowedExtensions.includes(extension);
}
