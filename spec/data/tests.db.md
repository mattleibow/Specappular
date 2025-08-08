---
id: data.storage.sqlite.tests
type: test
version: 0.1
parent: data.storage.sqlite
summary: "DB-specific tests"
refs:
  - data.storage.sqlite
---

# Database Tests

```specapp-test
id: test.db.todos.timestamps
scope: db
target: data.storage.sqlite
arrange:
  db: inMemory
steps:
  - repo:
      action: create
      entity: Todo
      values: { title: "Timestamps" }
    capture:
      createdAt: "$result.createdAt"
      updatedAt: "$result.updatedAt"
  - repo:
      action: update
      entity: Todo
      values: { id: "$capture.id", title: "Timestamps 2" }
    expect:
      result.updatedAt: ">$capture.updatedAt"
```
