---
sidebar_position: 2.8
title: Lifecycles & Workflows
---

# Lifecycles, Workflows, and Change Actions

This document explains how item lifecycles, ECO workflows, and the versioning system work together in Cascadia. Understanding this relationship is key to configuring the system correctly.

## The Core Principle

> **All item state changes go through ECOs.**

Items (Parts, Documents, Requirements) don't have manual state transitions. Their lifecycle states only change when an ECO releases. This is fundamentally different from traditional PLM systems.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   Traditional PLM:                                                       │
│   Item states change via manual transitions OR ECO effects               │
│   (confusing, hard to audit, easy to bypass)                            │
│                                                                          │
│   Cascadia:                                                              │
│   Item states ONLY change via ECO release                               │
│   (clear, auditable, controlled)                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```


## The Three-Layer Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  LAYER 3: VERSIONING                                                     │
│  ───────────────────                                                     │
│  Branches, commits, merge to main                                        │
│  Controls: "What's the released state of items?"                        │
│  Mechanism: ECO branch merges to main on release                        │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LAYER 2: CHANGE ACTIONS                                                 │
│  ───────────────────────                                                 │
│  Release, Revise, Obsolete, Add, Remove                                  │
│  Controls: "What happens to each item when the ECO releases?"           │
│  Configured: In the item's lifecycle definition                         │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  LAYER 1: LIFECYCLES & WORKFLOWS                                         │
│  ───────────────────────────────                                         │
│  Lifecycles: Valid states for items (no manual transitions)             │
│  Workflows: Approval process for ECOs (manual transitions)              │
│  Controls: "What states exist?" and "How do we approve changes?"        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```


## Lifecycles vs Workflows

| Aspect | Lifecycle (Items) | Workflow (ECOs) |
|--------|-------------------|-----------------|
| **Used by** | Parts, Documents, Requirements | Change Orders |
| **States represent** | Release status | Approval status |
| **Transitions** | Automatic (via ECO release) | Manual (human actions) |
| **Example states** | Draft, Released, Superseded, Obsolete | Draft, Submitted, Approved, Implemented |
| **Who triggers** | System (on ECO release) | Users (submit, approve, reject) |

### Lifecycle Example: Part

```
States:
  • Draft      - Item is being created, not yet released
  • Released   - Item is approved for use
  • Superseded - Item has been replaced by a newer revision
  • Obsolete   - Item is end-of-life, no replacement

Change Action Mappings:
  • Release  → Draft to Released
  • Revise   → Old: Released to Superseded, New: to Released  
  • Obsolete → Released to Obsolete
```

### Workflow Example: Change Order

```
States:
  • Draft     - ECO is being prepared
  • Submitted - ECO is awaiting approval
  • Approved  - ECO is approved, ready to release
  • Implemented - ECO has been released (terminal)
  • Cancelled - ECO was cancelled (terminal)

Transitions (manual):
  • Submit     - Draft → Submitted (by author)
  • Approve    - Submitted → Approved (by approvers)
  • Reject     - Submitted → Draft (by approvers)
  • Release    - Approved → Implemented (by author/system)
  • Cancel     - Any → Cancelled (by author/admin)
```


## Change Actions

Change Actions are the **verbs** that describe what happens to an item when an ECO releases. They fall into two categories:

### State-Changing Actions

These actions trigger item lifecycle state transitions:

| Action | From State | To State | Creates New Version | Assigns Revision |
|--------|------------|----------|---------------------|------------------|
| **Release** | Draft | Released | No | Yes (A) |
| **Revise** | Released | Released (new), Superseded (old) | Yes | Yes (B, C, ...) |
| **Obsolete** | Released | Obsolete | No | No |

### Membership Actions

These actions affect relationships, not item state:

| Action | Effect | Item State |
|--------|--------|------------|
| **Add** | Link existing Released item to branch (e.g., add to BOM) | No change |
| **Remove** | Unlink item from branch (e.g., remove from BOM) | No change |


## How It All Connects

### Step-by-Step: Revising a Part

```
1. STARTING STATE
   ├── Part PN-001 Rev A (Released) exists on main branch
   └── Part lifecycle: Draft → Released → Superseded/Obsolete

2. CREATE ECO
   ├── User creates ECO-001 (Draft state in ECO workflow)
   └── Adds PN-001 with Change Action = "Revise"

3. CHECKOUT & EDIT
   ├── User checks out PN-001 for editing
   ├── System creates eco/ECO-001 branch
   ├── System creates working copy: PN-001 Rev "-" (Editable)
   └── User makes changes on ECO branch

4. ECO APPROVAL (Workflow transitions - manual)
   ├── User submits ECO: Draft → Submitted
   ├── Approvers review
   └── Approvers approve: Submitted → Approved

5. ECO RELEASE (Change Actions execute - automatic)
   ├── User clicks "Release ECO"
   ├── System processes each affected item by its Change Action:
   │
   │   For PN-001 (Action = Revise):
   │   ├── Old version: PN-001 Rev A → Superseded
   │   ├── New version: PN-001 Rev B → Released
   │   └── Revision letter assigned
   │
   ├── Merge eco/ECO-001 → main
   ├── Create merge commit
   ├── Archive ECO branch
   └── ECO state: Approved → Implemented

6. FINAL STATE
   ├── PN-001 Rev A (Superseded) - historical
   └── PN-001 Rev B (Released) - current
```

### Diagram: The Release Moment

```
                     ECO-001 Approved
                           │
                           │ User clicks "Release"
                           ▼
          ┌────────────────────────────────────┐
          │         ECO RELEASE                │
          │                                    │
          │  For each affected item:           │
          │  ┌──────────────────────────────┐  │
          │  │ Item: PN-001                 │  │
          │  │ Action: Revise               │  │
          │  │                              │  │
          │  │ 1. Look up "Revise" in       │  │
          │  │    Part lifecycle config     │  │
          │  │                              │  │
          │  │ 2. Execute:                  │  │
          │  │    Old → Superseded          │  │
          │  │    New → Released            │  │
          │  │    Assign Rev B              │  │
          │  └──────────────────────────────┘  │
          │                                    │
          │  Merge branch → main               │
          │  Create commit                     │
          └────────────────────────────────────┘
                           │
                           ▼
                  ECO-001 Implemented
```


## Concrete Examples

### Example 1: First Release of a New Part

**Scenario**: Engineer creates PN-NEW during ECO-001

```
ECO-001 Affected Items:
┌──────────┬───────────────┬─────────┬──────────────────┐
│ Item     │ Current State │ Action  │ After Release    │
├──────────┼───────────────┼─────────┼──────────────────┤
│ PN-NEW   │ Draft         │ Release │ Rev A, Released  │
└──────────┴───────────────┴─────────┴──────────────────┘

Lifecycle transition: Draft → Released
Revision assigned: A
```

### Example 2: Revise an Existing Part

**Scenario**: Motor mount PN-001 needs dimensional changes

```
ECO-002 Affected Items:
┌──────────┬───────────────┬─────────┬──────────────────────────┐
│ Item     │ Current State │ Action  │ After Release            │
├──────────┼───────────────┼─────────┼──────────────────────────┤
│ PN-001   │ Rev A Released│ Revise  │ Rev A Superseded         │
│          │               │         │ Rev B Released (new)     │
└──────────┴───────────────┴─────────┴──────────────────────────┘

Lifecycle transitions:
  - PN-001 Rev A: Released → Superseded
  - PN-001 Rev B: (new) → Released
Revision assigned: B
```

### Example 3: Add Standard Part to BOM

**Scenario**: Assembly needs a standard bolt that's already released

```
ECO-003 Affected Items:
┌────────────┬───────────────┬─────────┬──────────────────────────┐
│ Item       │ Current State │ Action  │ After Release            │
├────────────┼───────────────┼─────────┼──────────────────────────┤
│ ASSY-001   │ Rev A Released│ Revise  │ Rev A Superseded         │
│            │               │         │ Rev B Released           │
│ PN-BOLT-01 │ Rev A Released│ Add     │ (unchanged)              │
└────────────┴───────────────┴─────────┴──────────────────────────┘

Lifecycle transitions:
  - ASSY-001: Released → Superseded (old), Released (new)
  - PN-BOLT-01: NO CHANGE (Add doesn't affect state)

Result: ASSY-001 Rev B's BOM now includes PN-BOLT-01
```

### Example 4: Remove Part from BOM

**Scenario**: Assembly no longer needs a component

```
ECO-004 Affected Items:
┌────────────┬───────────────┬─────────┬──────────────────────────┐
│ Item       │ Current State │ Action  │ After Release            │
├────────────┼───────────────┼─────────┼──────────────────────────┤
│ ASSY-001   │ Rev B Released│ Revise  │ Rev B Superseded         │
│            │               │         │ Rev C Released           │
│ PN-OLD     │ Rev A Released│ Remove  │ (unchanged)              │
└────────────┴───────────────┴─────────┴──────────────────────────┘

Lifecycle transitions:
  - ASSY-001: Released → Superseded (old), Released (new)
  - PN-OLD: NO CHANGE (Remove doesn't affect state)

Result: ASSY-001 Rev C's BOM no longer includes PN-OLD
        PN-OLD still exists, could be used elsewhere
```

### Example 5: Obsolete a Part

**Scenario**: Part is end-of-life, no replacement

```
ECO-005 Affected Items:
┌──────────┬───────────────┬──────────┬─────────────────┐
│ Item     │ Current State │ Action   │ After Release   │
├──────────┼───────────────┼──────────┼─────────────────┤
│ PN-OLD   │ Rev A Released│ Obsolete │ Rev A Obsolete  │
└──────────┴───────────────┴──────────┴─────────────────┘

Lifecycle transition: Released → Obsolete
No new revision (same Rev A, different state)
```

### Example 6: Replace One Part with Another

**Scenario**: Old motor replaced with new motor in assembly

```
ECO-006 Affected Items:
┌──────────────┬───────────────┬──────────┬──────────────────────┐
│ Item         │ Current State │ Action   │ After Release        │
├──────────────┼───────────────┼──────────┼──────────────────────┤
│ ASSY-001     │ Rev C Released│ Revise   │ Rev C Superseded     │
│              │               │          │ Rev D Released       │
│ PN-MOTOR-OLD │ Rev A Released│ Obsolete │ Rev A Obsolete       │
│ PN-MOTOR-NEW │ Rev A Released│ Add      │ (unchanged)          │
└──────────────┴───────────────┴──────────┴──────────────────────┘

This is three actions working together:
  1. Revise assembly (updates BOM)
  2. Obsolete old motor
  3. Add new motor to BOM
```


## Configuration

### Lifecycle Definition

Lifecycles are configured in the admin UI. A lifecycle defines:

1. **States** - Valid states for items using this lifecycle
2. **Initial State** - State when item is created (typically "Draft")
3. **Final States** - Terminal states (Released, Obsolete, Superseded)
4. **Change Action Mappings** - What each action does

```typescript
// Conceptual structure (stored in workflow_definitions table)
{
  name: "Part - Default Lifecycle",
  type: "lifecycle",
  
  states: [
    { id: "draft", name: "Draft", isInitial: true },
    { id: "released", name: "Released", isFinal: true },
    { id: "superseded", name: "Superseded", isFinal: true },
    { id: "obsolete", name: "Obsolete", isFinal: true },
  ],
  
  changeActions: {
    release: {
      fromState: "draft",
      toState: "released",
      assignsRevision: true,
    },
    revise: {
      fromState: "released",
      newVersionState: "released",
      oldVersionState: "superseded",
      assignsRevision: true,
    },
    obsolete: {
      fromState: "released",
      toState: "obsolete",
      assignsRevision: false,
    },
    // add and remove don't need configuration - they don't affect state
  },
}
```

### Workflow Definition

ECO workflows define the approval process:

```typescript
// Conceptual structure (stored in workflow_definitions table)
{
  name: "Standard ECO Workflow",
  type: "workflow",
  
  states: [
    { id: "draft", name: "Draft", isInitial: true },
    { id: "submitted", name: "Submitted" },
    { id: "approved", name: "Approved" },
    { id: "implemented", name: "Implemented", isFinal: true },
    { id: "cancelled", name: "Cancelled", isFinal: true },
  ],
  
  transitions: [
    { from: "draft", to: "submitted", name: "Submit", 
      allowedRoles: ["author", "engineer"] },
    { from: "submitted", to: "approved", name: "Approve", 
      allowedRoles: ["approver", "manager"] },
    { from: "submitted", to: "draft", name: "Reject", 
      allowedRoles: ["approver", "manager"] },
    { from: "approved", to: "implemented", name: "Release", 
      allowedRoles: ["author", "engineer"] },
    { from: "*", to: "cancelled", name: "Cancel", 
      allowedRoles: ["author", "admin"] },
  ],
}
```


## Why Not Lifecycle Effects?

Traditional PLM systems often use "lifecycle effects" where ECO state transitions automatically trigger item state transitions:

```
❌ Traditional approach:
   ECO moves to "Approved" → All attached Parts move to "In Review"
   ECO moves to "Implemented" → All attached Parts move to "Released"
```

This is problematic because:

| Problem | Description |
|---------|-------------|
| **Tight coupling** | ECO workflow and item lifecycles are intertwined |
| **Hard to configure** | Changes to one affect the other unpredictably |
| **Confusing states** | Item shows "In Review" even though it's not really in review |
| **Bypass risk** | Items might change state without full ECO approval |
| **Audit confusion** | "Why did this part change state?" requires tracing ECO history |

Cascadia's approach:

```
✓ Cascadia approach:
   ECO workflow manages approval (human decisions)
   Item state changes ONLY at the merge point (ECO release)
   Change Actions define exactly what happens to each item
```

Benefits:
- **Clear separation**: Workflows govern approval, lifecycles govern item states
- **Explicit actions**: Each item has a specific Change Action
- **Single point of change**: Items change state at one well-defined moment
- **Easy audit**: "This part became Released in commit X from ECO-001"


## Querying Item Status

Since items don't have an "In Review" state, how do you find items being worked on?

```typescript
// Items currently being revised (on any ECO branch)
const inProgress = await db
  .select()
  .from(branchItems)
  .innerJoin(branches, eq(branchItems.branchId, branches.id))
  .where(and(
    eq(branches.branchType, 'eco'),
    eq(branches.isArchived, false)
  ))

// Items on a specific ECO
const ecoItems = await ChangeOrderService.getAffectedItems(ecoId)

// Items awaiting approval (on ECOs in Submitted/Approved state)
const awaitingApproval = await db
  .select()
  .from(changeOrderAffectedItems)
  .innerJoin(changeOrders, ...)
  .innerJoin(items, ...)  // ECO item
  .where(inArray(items.state, ['Submitted', 'Approved']))
```


## Summary

| Concept | Purpose | Has Manual Transitions? |
|---------|---------|-------------------------|
| **Lifecycle** | Define valid states for items | No - only via ECO release |
| **Workflow** | Define approval process for ECOs | Yes - submit, approve, etc. |
| **Change Action** | Define what happens to item on release | N/A - it's a mapping |
| **Versioning** | Track history, isolate work, merge changes | N/A - it's infrastructure |

The key insight: **ECO approval and item state changes are separate concerns that meet at the release point.**


## See Also

- [Git-Style Versioning](./versioning) - How branching and merging work
- [Service Patterns](./service-patterns) - Using EcoReleaseService
- [Database Patterns](./database-patterns) - Schema details
