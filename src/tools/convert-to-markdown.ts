export interface ConvertOptions {
	format?: "md" | "mdx";
}

export interface ConvertResult {
	output: string;
	warnings: string[];
}

export function convertReactToMarkdown(_input: string, options: ConvertOptions = {}): ConvertResult {
	const format = options.format ?? "md";

	return {
		output: "",
		warnings: [
			`Conversion engine is not implemented yet for '${format}'. This will be added in a later phase.`,
		],
	};
}
