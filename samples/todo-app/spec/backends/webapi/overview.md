---
id: backend.webapi
type: app
version: 0.1
parent: app.todo
summary: "ASP.NET Core Web API overview"
refs:
  - backend.webapi.todos
  - data.storage.sqlite
---

# Web API Overview

- Framework: ASP.NET Core 9 minimal APIs
- Base path: `/api`
- Resources: `/api/todos`
- DI: Domain services injected via interfaces
- Persistence: EF Core SQLite
- Content type: JSON (application/json)
- Error format:
  - 400: `{ code, message, details? }`
  - 404: `{ code: "NOT_FOUND", message }`
