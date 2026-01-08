---
sidebar_position: 5
title: Tasks & Kanban
---

# Tasks & Kanban Board

Tasks in Cascadia help you track work items, coordinate team activities, and manage project progress. The Kanban board provides visual workflow management for engineering tasks.

## Tasks Overview

The Tasks page displays your work items in either Kanban board or list view.

### Summary Statistics

At the top of the page, you'll see counts for each task state:

| Statistic | Description |
|-----------|-------------|
| **Total Tasks** | All tasks in the system |
| **Backlog** | Tasks identified but not yet scheduled |
| **To Do** | Tasks scheduled to be worked on |
| **In Progress** | Tasks currently being worked |
| **In Review** | Tasks completed and awaiting review |
| **Done** | Completed and verified tasks |

### View Options

Toggle between two views using the buttons in the top right:

- **Kanban** - Visual board with drag-and-drop columns
- **List** - Traditional table view with sorting and filtering

## Kanban Board

The Kanban board organizes tasks into columns representing their workflow state.

### Columns

| Column | Purpose |
|--------|---------|
| **Backlog** | Tasks identified but not prioritized |
| **To Do** | Tasks ready to be started |
| **In Progress** | Tasks currently being worked on |
| **In Review** | Tasks awaiting verification |
| **Done** | Completed tasks |

### Moving Tasks

To update a task's status:
1. Click and hold on a task card
2. Drag it to the target column
3. Release to drop

The task's state automatically updates to match the column.

### Task Cards

Each task card shows:
- Task number (e.g., TSK-000001)
- Task name
- Priority indicator
- Assignee avatar (if assigned)
- Due date (if set)

## Creating a Task

1. Click **+ Create Task** in the top right
2. Fill in the task details:

### Task Fields

| Field | Description | Required |
|-------|-------------|----------|
| **Task Number** | Auto-generated identifier (e.g., TSK-000001) | Auto |
| **Revision** | Version identifier | Yes |
| **Task Name** | Brief description of the work | Yes |
| **Description** | Detailed task description | No |
| **State** | Initial workflow state | No (defaults to Backlog) |
| **Priority** | Urgency level (Low, Medium, High, Critical) | No |
| **Assignee** | User responsible for the task | No |
| **Due Date** | Target completion date | No |
| **Estimated Hours** | Expected effort in hours | No |

3. Click **Create Task** to save

## Task States

Tasks flow through these states:

```
Backlog → To Do → In Progress → In Review → Done
```

| State | When to Use |
|-------|-------------|
| **Backlog** | Task is captured but not yet scheduled |
| **To Do** | Task is prioritized and ready to start |
| **In Progress** | Work has begun on the task |
| **In Review** | Task is complete, awaiting verification |
| **Done** | Task is verified and closed |

## Priority Levels

Use priority to indicate urgency:

| Priority | Description |
|----------|-------------|
| **Critical** | Blocking work, needs immediate attention |
| **High** | Important, should be completed soon |
| **Medium** | Normal priority (default) |
| **Low** | Can be deferred if needed |

## Working with Tasks

### Viewing Task Details

Click on any task to open its detail view. Here you can:
- Edit task information
- Add comments
- View activity history
- Link related items

### Filtering Tasks

Use the program/design dropdown to filter tasks by project scope. The search box filters by task number or name.

### Assigning Tasks

To assign a task:
1. Open the task detail view
2. Click the Assignee field
3. Select a team member from the dropdown

Assigned users see tasks in their personal task list.

### Setting Due Dates

Due dates help with planning:
1. Open the task or edit during creation
2. Click the Due Date field
3. Select a date from the calendar picker

Overdue tasks are highlighted in the Kanban view.

## Task Relationships

Tasks can be linked to other items in Cascadia:

- **Parts** - Track work related to specific parts
- **Documents** - Link to relevant documentation
- **Change Orders** - Associate tasks with ECOs
- **Requirements** - Connect to requirements being addressed

To create a relationship:
1. Open the task detail view
2. Go to the **Relationships** tab
3. Click **+ Add Relationship**
4. Search for and select the related item

## Best Practices

### Task Naming

Use clear, action-oriented names:
- Good: "Review Widget Assembly BOM for accuracy"
- Poor: "BOM review"

### Estimates

When setting estimated hours:
- Include time for testing and documentation
- Break large tasks into smaller ones (< 16 hours)
- Update estimates as you learn more

### Kanban Flow

- Limit work in progress to avoid bottlenecks
- Move tasks as soon as state changes
- Review the board in team standups
- Archive completed tasks periodically

### Using Backlog

The backlog is for:
- Ideas and future work
- Tasks waiting on dependencies
- Low-priority items

Regularly groom the backlog to keep it manageable.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open quick search |
| `N` | New task (when on tasks page) |

## Next Steps

- [Workflows](/user-guide/workflows) - Customize workflow states
- [Programs and Designs](/user-guide/programs-and-designs) - Organize tasks by project
- [Change Orders](/user-guide/change-orders) - Link tasks to ECOs
