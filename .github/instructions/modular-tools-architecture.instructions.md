---
description: "Use when adding or refactoring features in this project. Enforces modular architecture and feature-per-file organization"
applyTo: "src/tools/**/*.ts"
---
# Modular Tools Architecture

- Treat each feature as an isolated module.
- Create one feature per file under src/tools.
- Keep file responsibilities narrow: one main feature capability per file.
- Use descriptive file names that reflect the feature, for example parse-component.ts or render-markdown.ts.
- Avoid combining multiple unrelated features in one file.
- If a workflow needs multiple features, split them into separate files and compose them through imports.
- Keep shared types and pure helpers in separate modules when reused across feature files.
- If an index file is used, keep it as a thin export surface only.
- Add a minimal comment to each file describing its purpose.