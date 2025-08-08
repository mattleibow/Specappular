# specapp CLI (design doc)

Commands:
- `specapp init` — scaffold directories and example spec files.
- `specapp plan --spec spec --out .specapp/plan.json`
  - Parse Markdown (front matter + headings) into a domain model.
  - Emit a normalized plan with tasks (create screen, add route, create model).
- `specapp generate --plan .specapp/plan.json --out codegen`
  - Apply templates (deterministic).
  - Use LLM to fill glue code and tests (structured JSON edits).
  - Update `.specapp/SpecLock.json` and annotate generated files.
- `specapp watch` — watch `spec/` and regenerate to a working branch.

Artifacts:
- `.specapp/plan.json` — ordered tasks.
- `.specapp/SpecLock.json` — map spec-id → files with content-hash and ownership.
- `.specapp/traces/*` — prompts, responses, diffs.

Safety:
- Only modify files listed and owned in the lockfile.
- Never touch `src/` unless explicitly allowed.
- Patch using syntax-aware diffs when editing existing files.

Implementation notes:
- Language: TypeScript or C#; pick what fits your target platform first.
- Markdown parsing: `unified/remark` (TS) or Markdig (.NET).
- LLM: OpenAI/Azure OpenAI; use function calling + JSON schemas.
- Patching: tree-sitter or Roslyn (C#) for safer merges.