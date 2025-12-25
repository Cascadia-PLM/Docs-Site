---
sidebar_position: 3
title: Change Orders
---

# Change Orders (ECO/ECN)

Change Orders are the formal mechanism for managing modifications to released items in Cascadia PLM. They provide traceability, approval workflows, and coordinated state management.

## Types of Change Orders

| Type | Full Name | Purpose |
|------|-----------|---------|
| **ECO** | Engineering Change Order | Proposes changes to engineering items |
| **ECN** | Engineering Change Notice | Notifies stakeholders of approved changes |
| **ECR** | Engineering Change Request | Requests a change (precedes ECO) |

Cascadia uses a unified Change Order item type that can represent any of these through configuration.

## Change Order Lifecycle

A typical ECO workflow:

```
Draft → Impact Review → Technical Review → Approved → Released → Closed
                                                    ↘ Cancelled
```

### Workflow States

| State | Description |
|-------|-------------|
| **Draft** | Initial creation, gathering affected items |
| **Impact Review** | Assessing scope and impact of changes |
| **Technical Review** | Engineering validation of proposed changes |
| **Approved** | Changes authorized, ready for implementation |
| **Released** | Changes implemented, affected items updated |
| **Closed** | Change order completed |
| **Cancelled** | Change order rejected or abandoned |

## Change Orders List Overview

The Change Orders page displays all ECOs with summary statistics and filtering options.

![Change Orders List](/img/screenshots/change-orders-list.png)
*The change orders list shows all ECOs with their status, priority, and type.*

### Summary Statistics

At the top of the page, you'll see summary cards showing:

| Statistic | Description |
|-----------|-------------|
| **Total ECOs** | Count of all change orders |
| **Draft** | ECOs in initial creation |
| **In Review** | ECOs awaiting approval |
| **Released** | ECOs that have been implemented |

### Filtering and Search

- **Search**: Find ECOs by item number or title
- **Column Sorting**: Click column headers to sort
- **Status Filters**: Filter by workflow state

## Creating a Change Order

1. Navigate to **Change Orders** in the sidebar
2. Click **+ Create ECO** in the top right
3. Fill in the required fields:

### Required Fields

| Field | Description |
|-------|-------------|
| **Design** | The design this ECO affects |
| **Item Number** | Unique identifier (auto-generated, e.g., ECO-001) |
| **Title** | Brief description of the change |

### Optional Fields

| Field | Description |
|-------|-------------|
| **Description** | Detailed explanation of the change |
| **Reason for Change** | Why this change is needed |
| **Priority** | Urgency level (Low, Medium, High, Critical) |
| **Type** | ECO, ECN, or ECR |

4. Click **Create** to save the ECO in Draft state

## ECO Detail View

Click on any ECO number to open the detail view. The detail page has three tabs: **Overview**, **Affected Items**, and **History**.

### Header Information

The header shows:
- ECO number with state badge (Draft, In Review, etc.)
- ECO title
- Branch indicator showing the ECO's working branch
- Action buttons based on available workflow transitions

### Overview Tab

The Overview tab displays:

**Basic Information**
- Item Number and Title
- Current State
- Description and Reason for Change

**Change Details**
- Priority level
- Type (ECO/ECN/ECR)
- Target completion date (if set)

### Affected Items Tab

The Affected Items tab shows all items included in the change order with a hierarchical tree view.

**Tree Structure**
- Expand/collapse affected items to see their children
- Each item shows: Item Number, Revision, Name, Type, State
- Change action badge indicates what will happen (Release, Revise, etc.)

**Adding Affected Items**
1. Click **+ Add Affected Item**
2. Search for the item to include
3. Select the change action
4. Confirm the addition

### History Tab

Shows the complete workflow history:
- State transitions with timestamps
- User who performed each action
- Approval votes and comments
- Guard evaluation results

## Adding Affected Items

Affected items are the parts, documents, or other items that will be modified by the change order.

### Change Actions

Each affected item has a **change action** that describes what will happen:

| Action | Description | Effect on Item |
|--------|-------------|----------------|
| **Release** | First release of a new item | Item transitions through lifecycle to Released |
| **Revise** | Create a new revision | New revision created, original superseded |
| **Obsolete** | Mark item as obsolete | Item transitions to Obsolete state |
| **Replace** | Replace with another item | Original obsoleted, replacement released |
| **Add** | Add to an assembly | Item added to BOM |
| **Remove** | Remove from assembly | Item removed from BOM |

### Adding Items

1. Open the Change Order
2. Go to the **Affected Items** tab
3. Click **Add Affected Item**
4. Search for and select the item
5. Choose the change action
6. Optionally specify a target state

## Workflow Transitions

### Executing a Transition

1. Open the Change Order
2. View available transitions in the toolbar or sidebar
3. Click the transition button (e.g., "Submit for Review")
4. If required, add comments
5. Confirm the transition

### Guards and Validation

Before a transition executes, guards are evaluated:

- **Field guards**: Required fields must be populated
- **Role guards**: User must have appropriate roles
- **Approval guards**: Sufficient approvals must be received
- **Lifecycle effects**: Affected item guards are validated (if configured)

If any guard fails, the transition is blocked with an error message.

### Approvals

For transitions requiring approval:

1. Designated approvers receive notifications
2. Each approver reviews and votes (Approve/Reject)
3. Approvers can add comments
4. Once sufficient approvals are collected, the transition can proceed

## Lifecycle Effects

Lifecycle effects coordinate the state of affected items with the ECO workflow. When an ECO transitions, its affected items can automatically progress through their lifecycles.

### How It Works

```
ECO Workflow State    │ Part Lifecycle (Release Action)
──────────────────────┼─────────────────────────────────
Draft                 │ Preliminary (no change)
        ↓             │
Impact Review         │ Preliminary (no mapping defined)
        ↓             │
Technical Review      │ Under Review ← triggered by effect
        ↓             │
Approved              │ Released ← triggered by effect
```

When the ECO transitions to "Technical Review", parts with the "Release" action automatically transition from "Preliminary" to "Under Review".

### Configuration

Lifecycle effects are configured per ECO workflow transition in the workflow builder:

![Lifecycle Effects Panel](/img/screenshots/lifecycle-effects-panel.png)
*The transition properties panel showing lifecycle effects configuration.*

1. **Change Action**: Which affected item action this applies to (Release, Revise, etc.)
2. **Target Lifecycle**: The lifecycle definition to use
3. **From State**: The current state the item must be in
4. **To State**: The state to transition the item to
5. **Validate Guards**: Whether to check lifecycle guards before the ECO can transition

### Guard Pre-validation

When "Validate Guards" is enabled, the ECO transition will fail if any affected item's lifecycle guards don't pass. This ensures:

- All items are ready before the ECO proceeds
- Issues are caught early in the process
- No partial transitions occur

### Example: Requiring Description

1. Part lifecycle has guard: "description is_not_empty" on "Under Review → Released"
2. ECO has lifecycle effect: Release items transition to "Released" when ECO becomes "Approved"
3. User tries to approve ECO with a part that has no description
4. Transition fails: "Part P-00001: Description is required before release"
5. User adds description to part
6. Retry succeeds

## Impact Assessment

Before approving a change, assess its impact:

### Where-Used Analysis

View all assemblies and products that use affected items:

1. Open the Change Order
2. Go to **Impact** tab
3. Review the where-used tree for each affected item

### Change Summary

The impact assessment shows:

- Total number of affected items
- Items by change action type
- Downstream impacts (where-used)
- Related change orders
- Estimated scope

## Workflow History

Every state change is recorded in the audit trail:

- Transition name and timestamp
- User who executed the transition
- Previous and new state
- Comments and vote records
- Guard evaluation results

Access history from the **History** tab on any change order.

## Best Practices

### Planning Changes

1. **Gather all affected items first**: Add all items before submitting for review
2. **Document the reason**: Explain why the change is necessary
3. **Assess impact early**: Review where-used before proceeding
4. **Coordinate with stakeholders**: Notify affected teams

### During Review

1. **Use comments**: Document discussions and decisions
2. **Track issues**: Create tasks for action items
3. **Iterate if needed**: Return to draft for significant changes

### After Release

1. **Verify implementation**: Confirm changes were applied correctly
2. **Close promptly**: Don't leave released ECOs open
3. **Archive documentation**: Ensure change rationale is preserved

## Troubleshooting

### Transition Blocked

If a transition is blocked:

1. Check the error message for which guard failed
2. For field guards: populate the required field
3. For role guards: ensure you have the required role
4. For approval guards: wait for more approvals
5. For lifecycle effects: fix the affected item issue

### Affected Item Not Updating

If an affected item doesn't change state:

1. Verify a lifecycle effect is configured for that transition
2. Check the change action matches the effect configuration
3. Confirm the item is in the expected "from state"
4. Review the item's lifecycle for the transition path

## See Also

- [Workflows & Lifecycles](./workflows) - Understanding state management
- [Lifecycle Management](/admin-guide/lifecycle-management) - Admin configuration
- [Parts Management](./parts-management) - Working with parts
