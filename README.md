# Specappular

Spec-driven AI development: edit Markdown specs under `spec/`, and the orchestrator generates or updates code and tests. Specs are both the source of truth and the human-friendly docs.

This repo contains:
- A spec structure that scales to complex, multi-component apps.
- A .NET-first orchestrator design (CLI named `specapp`) that can target any language over time.
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
- `.github/workflows/` — CI for spec-to-code PRs.

Safety
- `.specapp/SpecLock.json` tracks generated files and content hashes.
- Only files marked owned by Specapp are overwritten.
- Human code lives outside `codegen/`.

Roadmap (high level)
- v0: .NET-only target adapters (Console, Web API, xUnit, EF Core).
- v1: Plug-in adapters for more targets (.NET MAUI, Next.js, Python FastAPI, etc.).
- v1: Incremental refactoring support via syntax-aware patching (Roslyn/tree-sitter).
- v1: Rich acceptance test DSL and test data factories.

Getting started
- Install .NET 9 SDK (or latest LTS).
- Add API keys as repo secrets if using cloud LLMs (e.g., `OPENAI_API_KEY`).
- Explore `spec/index.md`, then run the CLI once wired up.
