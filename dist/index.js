"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertReactToMarkdown = convertReactToMarkdown;
function convertReactToMarkdown(_input, options = {}) {
    const format = options.format ?? "md";
    return {
        output: "",
        warnings: [
            `Conversion engine is not implemented yet for '${format}'. This will be added in a later phase.`,
        ],
    };
}
//# sourceMappingURL=index.js.map