---
id: backend.webapi.todos
type: api
version: 0.1
parent: backend.webapi
summary: "Todos REST API"
refs:
  - domain.todo.model
---

# Todos API

Routes
- GET `/api/todos?filter={all|active|completed}`
  - 200: `Todo[]`
- GET `/api/todos/{id}`
  - 200: `Todo`
  - 404: NOT_FOUND
- POST `/api/todos`
  - body: `{ title: string }`
  - 201: `Todo`
  - 400: INVALID_TITLE_*
- PUT `/api/todos/{id}`
  - body: `{ title?: string, done?: boolean }`
  - 200: `Todo`
  - 400/404
- DELETE `/api/todos/{id}`
  - 204 or 404

Validation
- Title required on create; optional but validated on update.

Tests (API level)
```specapp-test
id: test.api.todos.create-then-get
scope: api
target: backend.webapi.todos
arrange:
  server: inMemory
steps:
  - http:
      method: POST
      path: /api/todos
      body: { title: "Wash car" }
    expect:
      status: 201
      body.title: "Wash car"
  - http:
      method: GET
      path: /api/todos
      query: { filter: all }
    expect:
      status: 200
      body.length: 1
      body[0].title: "Wash car"
```
