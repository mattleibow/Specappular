---
id: tests.e2e.todos
type: test
version: 0.1
parent: app.todo
summary: "End-to-end scenarios via Console interacting with Web API and DB"
refs:
  - frontend.console
  - backend.webapi
  - data.storage.sqlite
---

# Todo E2E

Plain steps
1. Start the API server in test mode (in-memory DB)
2. Using the console client, create a todo with title "This is a note"
3. Using the console client, edit the todo and change title to "This is an updated note"
4. Using the console client, list todos and verify one entry titled "This is an updated note"

Structured
```specapp-test
id: test.e2e.console-api-db.crud
scope: e2e
target: app.todo
arrange:
  server: testHost
steps:
  - cli:
      command: add
      args: { title: "This is a note" }
    capture:
      id: "$stdout.extractId"
  - cli:
      command: edit
      args: { id: "$capture.id", title: "This is an updated note" }
  - cli:
      command: list
      args: { filter: all }
    expect:
      stdout.contains: "This is an updated note"
```
