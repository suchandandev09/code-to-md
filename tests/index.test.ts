import assert from "node:assert/strict";
import test from "node:test";

import { convertReactToMarkdown } from "../src/index";

test("uses md as default format", () => {
	const result = convertReactToMarkdown("Component.tsx");

	assert.equal(result.output, "");
	assert.equal(result.warnings.length, 1);
	assert.match(result.warnings[0], /'md'/);
});

test("accepts mdx format", () => {
	const result = convertReactToMarkdown("Component.tsx", { format: "mdx" });

	assert.equal(result.output, "");
	assert.equal(result.warnings.length, 1);
	assert.match(result.warnings[0], /'mdx'/);
});
