export interface ConvertConfig {
    allowedExtensions: string[];
}
export declare const DEFAULT_CONFIG: ConvertConfig;
export declare function getConfig(): ConvertConfig;
export declare function getAllowedExtensions(): string[];
export declare function isAllowedInputExtension(inputPath: string): boolean;
