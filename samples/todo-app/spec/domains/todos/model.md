---
id: domain.todo.model
type: model
version: 0.1
parent: app.todo
summary: "Todo domain entity and invariants"
---

# Data Model

Entity: Todo
- id: string (uuid)
- title: string (1-120 chars)
- done: boolean (default: false)
- createdAt: datetime (UTC)
- updatedAt: datetime (UTC)

Invariants
- Title is required, trimmed, max 120 chars.
- `updatedAt` updated on any mutation.

Operations
- createTodo(title)
- updateTodo(id, title?, done?)
- deleteTodo(id)
- listTodos(filter?: all|active|completed)

Validation errors
- INVALID_TITLE_EMPTY
- INVALID_TITLE_TOO_LONG
- NOT_FOUND

Tests
```specapp-test
id: test.domain.todo.model.create-valid
scope: model
target: domain.todo.model
steps:
  - action: createTodo
    args: { title: "Buy milk" }
    expect:
      result.done: false
      result.title: "Buy milk"
```

```specapp-test
id: test.domain.todo.model.update-title-empty
scope: model
target: domain.todo.model
arrange:
  seed:
    todos:
      - id: "11111111-1111-1111-1111-111111111111"
        title: "Initial"
        done: false
steps:
  - action: updateTodo
    args: { id: "11111111-1111-1111-1111-111111111111", title: "" }
    expectError: INVALID_TITLE_EMPTY
```
