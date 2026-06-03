# code-to-md

CLI and library to convert React component files to Markdown (`.md`) or MDX (`.mdx`).

> Current status: **Phase 1 placeholder**. The package wiring, API shape, and CLI entry point are ready. Actual file conversion logic is not implemented yet.

## Features

- Library API for conversion calls
- CLI entry point with argument parsing
- Format option support (`md` or `mdx`)
- TypeScript + ESLint setup
- Automated tests with Node test runner + `tsx`

## Installation

### From source

```bash
npm install
```

## Development

### Build

```bash
npm run build
```

### Type check

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

### Run tests

```bash
npm test
```

### Watch tests

```bash
npm run test:watch
```

## Mock Live Example

A complex React sample file is available at [mock/ComplexProjectBoard.tsx](mock/ComplexProjectBoard.tsx).

Run a live CLI conversion attempt against the sample:

```bash
npm run convert:mock
```

This currently exercises the CLI flow and format parsing. The actual markdown output is still placeholder behavior until the conversion engine is implemented.

## Configuration

Configure allowed input file extensions in [code2md.config.json](code2md.config.json):

```json
{
	"allowedExtensions": [".tsx", ".jsx"]
}
```

Local config can also use object form to control merge behavior:

```json
{
	"allowedExtensions": {
		"extensions": [".jsx"],
		"merge": true
	}
}
```

The CLI searches for this file from your current directory upward and blocks input files with non-allowed extensions.

Localized config behavior:

- Config is inherited from parent directories.
- If local config uses array form (`"allowedExtensions": [".jsx"]`), it replaces the effective extensions for that directory subtree.
- If local config uses object form with `"merge": true`, it merges local extensions with the effective config.
- If object form omits `merge` or sets `"merge": false`, it replaces the effective extensions.
- That scoped config applies only to that directory and its children.
- After processing leaves that directory, the local override is no longer applied.

## CLI Usage

After building, the binary is exposed as `code-to-md`.

```bash
code-to-md <input-file> [--format md|mdx]
code-to-md --list
```

Examples:

```bash
code-to-md ./Component.tsx
code-to-md ./Component.tsx --format mdx
code-to-md --list
```

Help:

```bash
code-to-md --help
```

## Library Usage

```ts
import { convertReactToMarkdown } from "code-to-md";

const result = convertReactToMarkdown("./Component.tsx", { format: "mdx" });

console.log(result.output);
console.log(result.warnings);
```

## API

### `convertReactToMarkdown(input, options?)`

- `input: string` - Path or identifier of the input source.
- `options?: { format?: "md" | "mdx" }`

Returns:

- `output: string`
- `warnings: string[]`

## Notes

- In the current placeholder phase, `output` is empty and warnings describe that conversion is pending implementation.
- Invalid CLI format values exit with status code `1`.
