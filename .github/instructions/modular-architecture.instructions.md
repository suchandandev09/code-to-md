---
description: "Use when adding or refactoring features, or fixing issues in this project. Enforces modular architecture and feature-per-file organization"
applyTo: "src/**/*.ts"
---
# Modular Architecture

- Treat each feature as an isolated module.
- Create one feature per file under src/tools.
- Place unit tests in a mirrored directory structure under src/tools/__tests__/, using the naming convention <feature-name>.test.ts.
- Keep file responsibilities narrow: one main feature capability per file.
- Use descriptive file names that reflect the feature, for example parse-component.ts or render-markdown.ts.
- Avoid combining multiple unrelated features in one file.
- If a workflow needs multiple features, split them into separate files and compose them through imports.
- Move a type or helper to a shared module as soon as it is used in more than one feature file.
- If an index file is used, place exactly one at src/tools/index.ts and limit its content to re-exports only - no logic, no types, no helpers.
- Add a single-line comment at the top of each file in the format: // <filename>: <one sentence describing the feature this file implements>.