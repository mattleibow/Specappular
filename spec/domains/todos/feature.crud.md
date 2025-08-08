---
id: domain.todo.feature.crud
type: feature
version: 0.1
parent: domain.todo.model
summary: "CRUD and filtering behavior"
refs:
  - backend.webapi.todos
  - frontend.console.todos
---

# Requirements

- Create a todo
- Update title and done state
- Delete a todo
- List with filters: all, active, completed

Acceptance criteria (human-friendly)
1. Create a todo with title "Task A"
2. Mark it as completed
3. Verify it appears in the completed list
4. Verify it does not appear in the active list

Gherkin
```gherkin
Feature: Todo CRUD and filtering
  Scenario: Create and complete
    Given no todos exist
    When I create a todo "Task A"
    And I mark "Task A" as done
    Then the completed list contains "Task A"
    And the active list does not contain "Task A"
```

Structured tests
```specapp-test
id: test.domain.todo.feature.complete-and-filter
scope: model
target: domain.todo.model
arrange:
  seed: { todos: [] }
steps:
  - action: createTodo
    args: { title: "Task A" }
  - action: updateTodo
    args: { id: "$last.result.id", done: true }
assert:
  completed.contains.title: "Task A"
  active.notContains.title: "Task A"
```
