---
id: frontend.console
type: app
version: 0.1
parent: app.todo
summary: "Console client overview"
refs:
  - frontend.console.todos.list
  - frontend.console.todos.detail
  - backend.webapi.todos
---

# Console Frontend

- Framework: .NET 9 Console
- Commands:
  - `list --filter {all|active|completed}`
  - `add --title "..."` (alias: `new`)
  - `done --id <id>` / `undone --id <id>`
  - `edit --id <id> --title "..." `
  - `delete --id <id>`
- Config: `API_BASE_URL` env var (default http://localhost:5180)

UX Guidelines
- Clear command usage help
- Stable exit codes (0 success, non-zero on error)
- JSON output mode `--json` for scripting
