import path from "node:path";
import fs from "node:fs";

export interface ConvertConfig {
	allowedExtensions: string[];
}

export const DEFAULT_CONFIG: ConvertConfig = {
	allowedExtensions: [".tsx", ".jsx"],
};

const CONFIG_FILE_NAME = "code-to-md.config.json";

function normalizeExtensions(extensions: string[] | undefined): string[] {
	if (!extensions || extensions.length === 0) {
		return DEFAULT_CONFIG.allowedExtensions;
	}

	return extensions.map((extension) => {
		const normalized = extension.trim().toLowerCase();
		return normalized.startsWith(".") ? normalized : `.${normalized}`;
	});
}

function findConfigFilePath(): string | null {
	let currentDir = process.cwd();

	for (;;) {
		const candidate = path.join(currentDir, CONFIG_FILE_NAME);
		if (fs.existsSync(candidate)) {
			return candidate;
		}

		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) {
			return null;
		}

		currentDir = parentDir;
	}
}

export function getConfig(): ConvertConfig {
	const configFilePath = findConfigFilePath();
	if (!configFilePath) {
		return DEFAULT_CONFIG;
	}

	try {
		const raw = fs.readFileSync(configFilePath, "utf8");
		const parsed = JSON.parse(raw) as { allowedExtensions?: string[] };
		return {
			allowedExtensions: normalizeExtensions(parsed.allowedExtensions),
		};
	} catch {
		return DEFAULT_CONFIG;
	}
}

export function getAllowedExtensions(): string[] {
	return getConfig().allowedExtensions;
}

export function isAllowedInputExtension(inputPath: string): boolean {
	const extension = path.extname(inputPath).toLowerCase();
	return getAllowedExtensions().includes(extension);
}
