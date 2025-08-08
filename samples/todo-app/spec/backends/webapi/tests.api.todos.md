---
id: backend.webapi.todos.tests
type: test
version: 0.1
parent: backend.webapi
summary: "Additional API test scenarios"
refs:
  - backend.webapi.todos
---

# API Tests: Edge cases

```specapp-test
id: test.api.todos.update-not-found
scope: api
target: backend.webapi.todos
arrange:
  server: inMemory
steps:
  - http:
      method: PUT
      path: /api/todos/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
      body: { title: "X" }
    expect:
      status: 404
      body.code: "NOT_FOUND"
```

```specapp-test
id: test.api.todos.create-invalid-title
scope: api
target: backend.webapi.todos
arrange:
  server: inMemory
steps:
  - http:
      method: POST
      path: /api/todos
      body: { title: "" }
    expect:
      status: 400
      body.code: "INVALID_TITLE_EMPTY"
```
