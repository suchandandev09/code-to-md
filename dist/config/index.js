"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
exports.getConfig = getConfig;
exports.getAllowedExtensions = getAllowedExtensions;
exports.isAllowedInputExtension = isAllowedInputExtension;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
exports.DEFAULT_CONFIG = {
    allowedExtensions: [".tsx", ".jsx"],
};
const CONFIG_FILE_NAME = "code-to-md.config.json";
function normalizeExtensions(extensions) {
    if (!extensions || extensions.length === 0) {
        return exports.DEFAULT_CONFIG.allowedExtensions;
    }
    return extensions.map((extension) => {
        const normalized = extension.trim().toLowerCase();
        return normalized.startsWith(".") ? normalized : `.${normalized}`;
    });
}
function findConfigFilePath() {
    let currentDir = process.cwd();
    for (;;) {
        const candidate = node_path_1.default.join(currentDir, CONFIG_FILE_NAME);
        if (node_fs_1.default.existsSync(candidate)) {
            return candidate;
        }
        const parentDir = node_path_1.default.dirname(currentDir);
        if (parentDir === currentDir) {
            return null;
        }
        currentDir = parentDir;
    }
}
function getConfig() {
    const configFilePath = findConfigFilePath();
    if (!configFilePath) {
        return exports.DEFAULT_CONFIG;
    }
    try {
        const raw = node_fs_1.default.readFileSync(configFilePath, "utf8");
        const parsed = JSON.parse(raw);
        return {
            allowedExtensions: normalizeExtensions(parsed.allowedExtensions),
        };
    }
    catch {
        return exports.DEFAULT_CONFIG;
    }
}
function getAllowedExtensions() {
    return getConfig().allowedExtensions;
}
function isAllowedInputExtension(inputPath) {
    const extension = node_path_1.default.extname(inputPath).toLowerCase();
    return getAllowedExtensions().includes(extension);
}
//# sourceMappingURL=index.js.map