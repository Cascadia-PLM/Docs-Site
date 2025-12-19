---
sidebar_position: 6
title: Workflows & Lifecycles
---

# Workflows & Lifecycles

Cascadia PLM uses a dual state management system to control how items progress through their lifecycle and how changes are approved.

## Two Types of Definitions

Cascadia supports two distinct types of state machine definitions:

| Type | Purpose | Features | Used By |
|------|---------|----------|---------|
| **Lifecycle** | Passive state machines | Guards only, no approvals | Parts, Documents, Requirements |
| **Workflow** | Active approval processes | Guards, actions, approvals, lifecycle effects | Change Orders |

### Lifecycles

Lifecycles define the states an item can be in and the allowed transitions between states. They are **passive** - transitions only occur when explicitly triggered by a user or system action.

**Example: Part Lifecycle**
```
Preliminary → Under Review → Released → Superseded
                                    ↘ Obsolete
```

Key characteristics:
- Define valid states for item types
- Control which transitions are allowed
- Support guards (conditions that must be met)
- No built-in approval voting
- Transitions triggered manually or by workflow effects

### Workflows

Workflows are **active** approval processes used by Change Orders. They include all lifecycle features plus:
- Approval requirements (voting)
- Transition actions (send notifications, update fields, etc.)
- Lifecycle effects (coordinate changes to affected items)

**Example: ECO Workflow**
```
Draft → Impact Review → Technical Review → Approved → Released
```

## States

Each state in a lifecycle or workflow has:

| Property | Description |
|----------|-------------|
| Name | Display name (e.g., "Under Review") |
| Color | Visual indicator in the UI |
| Description | Optional explanation of the state |
| Initial | Whether items start in this state |
| Final | Whether this is an end state |

### State Types

- **Initial States**: Where new items begin (e.g., "Preliminary", "Draft")
- **Intermediate States**: Work-in-progress states (e.g., "Under Review", "Approved")
- **Final States**: End states that typically lock the item (e.g., "Released", "Obsolete", "Cancelled")

## Transitions

Transitions define the allowed paths between states. Each transition has:

| Property | Description |
|----------|-------------|
| Name | Display name for the transition action |
| From State | Source state |
| To State | Destination state |
| Description | Optional explanation |
| Guards | Conditions that must pass before transitioning |
| Allowed Roles | Users who can execute this transition |
| Actions | Operations to perform (workflows only) |
| Approval Requirement | Voting requirements (workflows only) |
| Lifecycle Effects | Item state coordination (workflows only) |

### Guards

Guards are conditions that must be satisfied before a transition can occur. Guard types include:

#### Field Value Guards
Check that a field meets a condition:
- `equals` / `not_equals`
- `contains`
- `is_empty` / `is_not_empty`
- `greater_than` / `less_than` / `greater_or_equal` / `less_or_equal`

**Example**: Require description before release
```
Field: description
Operator: is_not_empty
Error: "Description is required before release"
```

#### User Role Guards
Verify the user has required roles:
```
Required Roles: [Engineer, Quality]
Require All: false  (any matching role is sufficient)
```

#### Approval Count Guards
Check that sufficient approvals have been received:
```
Required Count: 2
Required Roles: [Manager, Lead Engineer]
```

### Actions (Workflows Only)

Actions execute during transitions. Supported action types:

| Action Type | Description |
|-------------|-------------|
| `send_notification` | Email users about the transition |
| `update_field` | Modify a field value on the item |
| `create_task` | Create a follow-up task |
| `push_lifecycle_changes` | Update affected item states (legacy) |
| `execute_script` | Run custom logic |

Actions can be configured to run `before` or `after` the transition completes.

### Approval Requirements (Workflows Only)

For workflows requiring approval:

| Setting | Description |
|---------|-------------|
| Required Count | Number of approvals needed |
| Required Roles | Which roles can approve (optional) |
| Require All | Whether all specified roles must approve |

Users vote "Approve" or "Reject" with optional comments. The transition only proceeds when the approval count is met.

## Using the Workflow Builder

Access the workflow builder from **Admin > Workflows**.

![Workflows List](/img/screenshots/workflows-list.png)
*The workflows list shows all workflow definitions with their status and statistics.*

### Creating a New Definition

1. Click **New Workflow** or **New Lifecycle**
2. Enter a name and description
3. Select applicable item types
4. Use the visual editor to add states and transitions

### Visual Editor

The workflow builder uses a drag-and-drop interface:

![Workflow Builder](/img/screenshots/workflow-builder.png)
*The visual workflow builder with states and transitions.*

- **Add State**: Click the "Add State" button or double-click the canvas
- **Connect States**: Drag from one state to another to create a transition
- **Edit State/Transition**: Click to select, then edit in the side panel
- **Delete**: Select and press Delete, or use the delete button

### Configuring Transitions

Select a transition to open the properties panel:

1. **Basic Info**: Name and description
2. **Guards**: Add conditions for the transition
3. **Actions**: Configure operations to perform (workflows only)
4. **Approval**: Set voting requirements (workflows only)
5. **Lifecycle Effects**: Configure affected item coordination (workflows only)

### Best Practices

1. **Start simple**: Begin with basic states and add complexity as needed
2. **Use descriptive names**: "Submit for Review" is clearer than "Transition 1"
3. **Add guards thoughtfully**: Prevent invalid transitions rather than cleaning up after
4. **Document states**: Use descriptions to explain what each state means
5. **Test before activating**: Validate the workflow logic before going live

## Assigning Definitions to Item Types

Lifecycles and workflows are linked to item types through the registry:

1. Create the lifecycle/workflow definition
2. In **Admin > Item Types**, edit the item type configuration
3. Select the appropriate lifecycle/workflow
4. Save changes

Items of that type will then use the assigned definition.

## Viewing Item State

On any item's detail page:
- Current state is shown as a colored badge
- Available transitions appear as action buttons
- Workflow history shows the audit trail of state changes

## See Also

- [Change Orders](./change-orders) - ECO/ECN workflow details
- [Lifecycle Management](/admin-guide/lifecycle-management) - Admin configuration
- [Custom Item Types](/admin-guide/custom-item-types) - Assigning lifecycles
