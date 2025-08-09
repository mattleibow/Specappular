# Specappular (VS Code Extension)

AI will read plain-English Markdown specs and create full applications.

Current extension behavior (minimal MVP):
- Specappular: Initialize App Spec — prompts for an app name and scaffolds a basic spec workspace (spec/, codegen/, src/, .specapp/ + placeholder Markdown files).
- Specappular: Generate — writes a small artifact to `codegen/hello.txt` and attempts to open Copilot Chat if available (so you can say "hello" to test connectivity).
- Setting: `specappular.autoGenerateOnSave` — when enabled, saving any Markdown file under `spec/` triggers "Generate".

This repository also includes a sample app under `samples/todo-app/`, intended to be opened as a separate VS Code workspace (open that folder directly). In that workspace, your specs live at `spec/`.

Planned functionality (to be implemented):

This repo contains:
- A VSCode extension that watches and builds an app based on the specs
- An example multi-file spec for a Todo app with:
  - Console frontend (C#)
  - ASP.NET Core Web API backend (C#)
  - Shared domain and data definitions
  - Test definitions (model, API, DB, UI/console, E2E)

MVP limits
- Focus on .NET targets (ASP.NET Core, Console, xUnit, EF Core).
- Generated code lives in `codegen/` and is safe to regenerate.
- CI opens PRs for any change under `spec/`.

Workflow
1. Author or edit specs in `spec/` (see `spec/index.md`).
2. Run `specapp plan` to see the generation plan.
3. Run `specapp generate` to create/update code in `codegen/`.
4. Run `specapp testgen` to generate tests from spec cases into `codegen/tests`.
5. Build and test locally, or push and let CI open a PR with generated changes.

Directories 
- `spec/` — Multi-file, componentized Markdown specs (source + docs).
- `codegen/` — Generated code (do not edit).
- `src/` — Hand-authored code (optional).
- `.specapp/` — Plan, lockfile, cache, traces.

Safety
- `.specapp/SpecLock.json` tracks generated files and content hashes.
- Only files marked owned by Specapp are overwritten.
- Human code lives outside `codegen/`.

Roadmap (high level)
- v0: .NET-only target adapters (Console, Web API, xUnit, EF Core).
- v1: Plug-in adapters for more targets (.NET MAUI, Next.js, Python FastAPI, etc.).
- v1: Incremental refactoring support via syntax-aware patching (Roslyn/tree-sitter).
- v1: Rich acceptance test DSL and test data factories.

Development
1. `npm install`
2. `npm run compile`
3. Press F5 to launch the Extension Development Host.