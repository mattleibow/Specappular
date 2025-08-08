---
id: data.storage.sqlite
type: data
version: 0.1
parent: app.todo
summary: "SQLite storage with EF Core"
refs:
  - domain.todo.model
---

# Storage

- Provider: EF Core SQLite
- Database file: `todo.db` (configurable)
- DbContext: `TodoDbContext`
- Entities: `TodoEntity` mapping 1:1 to domain `Todo` with snake_case columns

Schema
- Table: `todos`
  - id TEXT PRIMARY KEY
  - title TEXT NOT NULL
  - done INTEGER NOT NULL (0/1)
  - created_at TEXT NOT NULL
  - updated_at TEXT NOT NULL

Migrations
- Generated under `codegen/src/Backend.WebApi/Migrations`.

DB Tests
```specapp-test
id: test.db.todos.persistence
scope: db
target: data.storage.sqlite
arrange:
  db: inMemory
steps:
  - repo:
      action: create
      entity: Todo
      values: { title: "Persist me" }
  - repo:
      action: getAll
      entity: Todo
    expect:
      result.length: 1
      result[0].title: "Persist me"
```
