# Spec schema (conceptual)

Types
- app, architecture, domain, model, feature, api, screen, data, test

Core fields
- id (required)
- type (required)
- version (required)
- parent (optional)
- targets (optional)
- summary (optional)
- refs (optional array of spec ids)

Tests
- Prefer `specapp-test` YAML blocks:
  - id, scope, target, arrange, steps, assert
  - Specialized step kinds: `action`, `http`, `repo`, `cli`
  - Capture and interpolation via `$capture.*` and `$last.*`
