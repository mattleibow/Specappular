---
id: frontend.console.todos.list
type: screen
version: 0.1
parent: frontend.console
summary: "List screen/command"
refs:
  - backend.webapi.todos
---

# List Command

Behavior
- Default filter: `all`
- Displays: id (short), title, status, updatedAt

Usage examples
- `todo list`
- `todo list --filter completed`
- `todo list --json`

Tests
```specapp-test
id: test.ui.console.list-empty
scope: ui
target: frontend.console.todos.list
arrange:
  server: inMemory
  seed:
    todos: []
steps:
  - cli:
      command: list
    expect:
      stdout.contains: "No todos"
      exitCode: 0
```

```specapp-test
id: test.ui.console.list-json
scope: ui
target: frontend.console.todos.list
arrange:
  server: inMemory
  seed:
    todos:
      - title: "A"
      - title: "B"
steps:
  - cli:
      command: list
      args: { json: true }
    expect:
      stdout.json.length: 2
      exitCode: 0
```
