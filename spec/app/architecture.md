---
id: app.todo.architecture
type: architecture
version: 0.1
parent: app.todo
summary: "System architecture and component interactions"
refs:
  - domain.todo.model
  - backend.webapi
  - frontend.console
  - data.storage.sqlite
---

# Architecture

Components
- Domain: `Todo` entity and services for CRUD and filtering.
- Backend: ASP.NET Core Web API exposing `/api/todos`.
- Data: EF Core DbContext with SQLite (file `todo.db`).
- Frontend: Console app invoking backend endpoints (configurable base URL).

Data flow
1. Console invokes Web API endpoints over HTTP.
2. Web API uses Domain services that depend on a repository interface.
3. Repository is implemented via EF Core DbContext.
4. Tests substitute repositories with in-memory DbContext or fakes.

Projects (generated)
- codegen/src/Domain/ (domain models/services)
- codegen/src/Backend.WebApi/ (ASP.NET Core API)
- codegen/src/Frontend.Console/ (console client)
- codegen/tests/ (xUnit test projects for domain, api, db, console, e2e)
- codegen/build.sln (solution referencing all)
