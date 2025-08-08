---
id: app.todo.overview
type: app
version: 0.1
parent: app.todo
summary: "High-level overview and goals"
---

# Overview

Purpose
- Provide a simple, reliable Todo app for CLI usage with a Web API backend.

Goals
- Fast local workflow via Console client.
- Stateless Web API with EF Core SQLite persistence.
- Clear separation between domain logic and IO (API/DB/Console).

Non-goals (MVP)
- Authentication/Authorization
- Offline sync
- Multi-tenant

Key capabilities
- Manage todos: create, read, update, delete
- Filter active/completed
- Persistence across runs
