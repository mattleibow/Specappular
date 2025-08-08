---
id: app.todo
type: app
version: 0.1
summary: "Todo application with Console frontend and ASP.NET Core Web API backend"
targets: [dotnet]
---

# Specappular Example: Todo App

A spec-driven .NET app:
- Console frontend for task management
- ASP.NET Core Web API backend
- EF Core with SQLite (local) for persistence
- xUnit test suites generated from specs

Table of contents
- App
  - [Overview](app/overview.md)
  - [Architecture](app/architecture.md)
- Domains
  - Todos
    - [Model](domains/todos/model.md)
    - [CRUD Feature](domains/todos/feature.crud.md)
- Backend (Web API)
  - [Overview](backends/webapi/overview.md)
  - [Todos API](backends/webapi/api.todos.md)
  - [API Tests](backends/webapi/tests.api.todos.md)
- Frontend (Console)
  - [Overview](frontends/console/overview.md)
  - [List Screen](frontends/console/screen.list.md)
  - [Detail Screen](frontends/console/screen.detail.md)
  - [Console Tests](frontends/console/tests.console.todos.md)
- Data
  - [Storage](data/storage.md)
  - [DB Tests](data/tests.db.md)
- Acceptance / E2E
  - [Todo CRUD E2E](tests/acceptance/todos-e2e.md)

Conventions
- All generated files include headers with the source spec id and hash.
- Tests are generated from `specapp-test`, `gherkin`, or "Steps" sections.
