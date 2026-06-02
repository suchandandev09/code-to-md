export interface ConvertOptions {
    format?: "md" | "mdx";
}
export interface ConvertResult {
    output: string;
    warnings: string[];
}
export declare function convertReactToMarkdown(_input: string, options?: ConvertOptions): ConvertResult;
