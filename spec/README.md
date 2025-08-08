# Spec format and structure

Specs are Markdown with YAML front matter. Keep them small, single-purpose, and cross-linked. The folder tree mirrors the app's decomposition (domains, frontends, backends, data, tests).

ID conventions
- Global, dot-delimited IDs for reference and traceability.
- Examples: `app.todo`, `domain.todo.model`, `backend.webapi.todos`, `frontend.console.todos.list`.

Front matter fields (common)
```yaml
---
id: app.todo
type: app | domain | model | feature | api | screen | data | test | architecture
version: 0.1
parent: app.todo            # optional: parent spec id
targets: [dotnet]           # optional: platform group(s)
summary: "Short description"
refs:                       # optional: references to other spec ids
  - domain.todo.model
---
```

Sections you can use
- Purpose
- Requirements
- Architecture
- Data Model
- APIs
- UX / Screens
- Flows
- Constraints
- Acceptance Criteria
- Tests

Supported test authoring (in-spec)
- Human-friendly Steps lists (plain English)
- Gherkin scenarios (Given/When/Then)
- Structured YAML test cases (preferred for determinism)

We support all three; the CLI prefers structured YAML when present.

Test case (structured) fenced as `specapp-test`:
```specapp-test
id: test.domain.todo.crud.create-then-update
scope: model   # model | api | db | ui | e2e
target: domain.todo.model
arrange:
  seed:
    todos: []
steps:
  - action: createTodo
    args: { title: "This is a note" }
    expect:
      result.title: "This is a note"
      result.done: false
  - action: updateTodo
    args: { id: "$last.result.id", title: "This is an updated note" }
assert:
  todos.count: 1
  todos[0].title: "This is an updated note"
```

Gherkin is fenced as `gherkin`:
```gherkin
Feature: Todo editing
  Scenario: Edit an existing todo
    Given a todo with title "This is a note"
    When I change the title to "This is an updated note" and save
    Then I should see the todo titled "This is an updated note"
```

Plain Steps (parsed by LLM when needed):
1. Create a todo with the title: "This is a note"
2. Edit the todo and change the title to: "This is an updated note"
3. Save the todo
4. Verify that the todo now has the updated title: "This is an updated note"

Folder structure (recommended)
- `spec/index.md` — Table of contents + high-level overview
- `spec/app/` — App-wide overview/capabilities/architecture
- `spec/domains/` — Domain models and features (CRUD, search, etc.)
- `spec/backends/` — Backend components (APIs, auth, integrations)
- `spec/frontends/` — UI components (console, web, mobile)
- `spec/data/` — Persistence, schema, migrations, caching
- `spec/flows/` — Cross-cutting flows (sync, background jobs)
- `spec/tests/` — Acceptance/E2E suites (optional; tests can also live next to features)
