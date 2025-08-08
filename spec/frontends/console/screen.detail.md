---
id: frontend.console.todos.detail
type: screen
version: 0.1
parent: frontend.console
summary: "Detail/edit command(s)"
refs:
  - backend.webapi.todos
---

# Detail / Edit Commands

Commands
- `add --title "..."` creates a todo
- `edit --id <id> --title "..."` updates title
- `done --id <id>` / `undone --id <id>` toggles status
- `delete --id <id>` removes todo

Tests
```specapp-test
id: test.ui.console.add-and-edit
scope: ui
target: frontend.console.todos.detail
arrange:
  server: inMemory
steps:
  - cli:
      command: add
      args: { title: "This is a note" }
    expect:
      stdout.contains: "Created"
      exitCode: 0
  - cli:
      command: edit
      args: { id: "$last.stdout.extractId", title: "This is an updated note" }
    expect:
      stdout.contains: "Updated"
      exitCode: 0
```
