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

## CLI Usage

After building, the binary is exposed as `code-to-md`.

```bash
code-to-md <input-file> [--format md|mdx]
```

Examples:

```bash
code-to-md ./Component.tsx
code-to-md ./Component.tsx --format mdx
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
