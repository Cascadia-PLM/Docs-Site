---
sidebar_position: 2.6
title: Git-Style Versioning
---

# Git-Style Versioning

Cascadia uses a Git-inspired versioning model that enables parallel work, clean ECO cancellation, and complete audit history. This approach is fundamentally different from traditional PLM linear revision systems.

## Why Git-Style?

### Traditional PLM Problems

Traditional PLM systems use linear revision sequences:

```
Part PN-001: Rev A → Rev B → Rev C → Rev D
```

This creates problems:
- **Blocking**: Only one person can work on a revision at a time
- **Messy cancellation**: If you cancel ECO-002 after starting work, what happens to the changes?
- **Lost context**: Changes are just "the next revision" without grouping by purpose
- **Merge conflicts**: Two ECOs affecting the same part can't proceed in parallel

### Cascadia's Approach

Cascadia uses branches to isolate work:

```
main:        [A] ─────────────────── [B] ─────── [C]
              │                       ↑           ↑
eco/ECO-001:  └──[work]──[work]──────┘           │
                                                  │
eco/ECO-002:  ────────────[work]──[work]─────────┘
```

Benefits:
- **Parallel work**: Multiple ECOs can affect the same part simultaneously
- **Clean cancellation**: Delete the branch, no cleanup needed
- **Grouped changes**: All ECO-001 changes are together
- **Automatic merging**: Revision letters assigned on merge to main


## Core Concepts

### Design (Version Container)

A **Design** is a version container that holds items and their history. It maps to a SysML 2.0 Project.

```
Design: "Power Cart Prototype" (PC-PROTO)
├── main branch (released state)
├── eco/ECO-001 branch (archived)
├── eco/ECO-002 branch (archived)
├── eco/ECO-003 branch (active)
└── Tags: "Prototype v0.1", "Prototype v0.2"
```

Items belong to exactly one Design via their `designId` field.


### Branches

Branches represent isolated streams of work.

| Branch Type | Naming Convention | Purpose |
|-------------|-------------------|---------|
| `main` | `main` | Released/production state |
| `eco` | `eco/ECO-001` | Change order work |
| `workspace` | `workspace/kai` | Personal drafts (optional) |

**Key rules**:
- Every Design has exactly one `main` branch
- ECO branches are created automatically when items are checked out for an ECO
- Main branch is protected—you cannot directly modify items on main
- Only ECO release can merge to main


### Commits

Commits are immutable snapshots that record changes.

```typescript
commit: {
  id: 'abc-123',
  branchId: 'eco-branch-id',
  parentId: 'previous-commit-id',     // Standard parent
  mergeParentId: null,                // Set for merge commits
  message: 'Updated motor mount dimensions',
  itemsChanged: 1,
  itemsAdded: 0,
  itemsDeleted: 0,
  createdBy: 'user-id',
  createdAt: '2024-01-15T10:30:00Z',
}
```

**Merge commits** have two parents and record ECO releases:

```typescript
mergeCommit: {
  parentId: 'main-branch-head',       // Target branch
  mergeParentId: 'eco-branch-head',   // Source branch
  message: 'Merge ECO-001: Motor mount redesign',
  changeOrderItemId: 'eco-item-id',
  revisionsAssigned: {
    'PN-001': 'B',
    'PN-002': 'B',
  },
}
```


### Tags

Tags are named pointers to specific commits, used for baselines and releases.

```typescript
tag: {
  name: 'Prototype v0.1',
  tagType: 'release',
  commitId: 'merge-commit-from-eco-001',
  description: 'Initial release - 32 parts',
}
```

Common tag types:
- `release` - Product release (e.g., "v1.0.0")
- `baseline` - Design review baseline (e.g., "PDR-baseline")
- `eco-release` - Auto-created on ECO release
- `milestone` - Project milestones


### Branch Items

The `branchItems` table tracks which items are being worked on in each branch:

```typescript
branchItem: {
  branchId: 'eco-branch-id',
  itemMasterId: 'master-id-of-part',
  currentItemId: 'working-version-id',  // The version being edited
  baseItemId: 'released-version-id',    // What we started from
  changeType: 'modified',               // 'added', 'modified', 'deleted'
  checkedOutBy: 'user-id',
  checkedOutAt: '2024-01-15T09:00:00Z',
}
```

This enables:
- Tracking what's changed on a branch
- Detecting merge conflicts
- Knowing who has items checked out


## Workflows

### Creating a New Item

New items are created in Draft state, typically on main (for initial setup) or on a branch (for controlled changes):

```
1. Create item on main (Draft state)
   └── PN-001 Rev - (Draft)

2. Later, release via ECO
   └── PN-001 Rev A (Released)
```


### ECO Workflow (Recommended)

The standard way to make changes to released items:

```
1. Create ECO (Change Order in Draft state)
   
2. Add affected items to ECO
   ├── PN-001 (revise A → B)
   └── PN-002 (revise A → B)

3. Checkout item for editing
   ├── System creates eco/ECO-001 branch if it doesn't exist
   ├── Creates branchItem entry
   └── Copies released version as starting point

4. Make changes on ECO branch
   ├── Edit item properties
   ├── Upload new files
   └── Update BOM relationships

5. Commit changes
   └── Creates commit on eco/ECO-001 branch

6. Submit & Approve ECO
   └── ECO moves through workflow states

7. Release ECO
   ├── Merge eco/ECO-001 → main
   ├── Assign revision letters (A → B)
   ├── Create new Released item versions
   ├── Create merge commit
   └── Archive ECO branch
```


### Viewing Historical State

You can view items as they existed at any point:

```typescript
// At a specific commit
const oldPart = await VersionResolver.getItemAtContext(
  masterId,
  designId,
  { type: 'commit', commitId: 'old-commit-id' }
)

// At a tag (baseline)
const baselinePart = await VersionResolver.getItemAtContext(
  masterId,
  designId,
  { type: 'tag', tagId: 'pdr-baseline-tag-id' }
)

// On a branch (working version)
const workingPart = await VersionResolver.getItemAtContext(
  masterId,
  designId,
  { type: 'branch', branchId: 'eco-branch-id' }
)

// Released state (main branch HEAD)
const releasedPart = await VersionResolver.getItemAtContext(
  masterId,
  designId,
  { type: 'released', designId: designId }
)
```


## Revision Letters

Revision letters (A, B, C, ..., Z, AA, AB, ...) are assigned **only when merging to main**.

### How It Works

1. Item exists on main: `PN-001 Rev A (Released)`
2. ECO branch modifies the item
3. On ECO release, system calculates next revision: `A → B`
4. New item version created: `PN-001 Rev B (Released)`
5. Old version marked: `PN-001 Rev A (Superseded)`

### Revision Calculation

```typescript
// EcoReleaseService.getNextRevision()
'A' → 'B'
'Z' → 'AA'
'AZ' → 'BA'
'ZZ' → 'AAA'
```

### New Items

Items created fresh on an ECO branch get revision `A` on their first release:

```
1. Create on ECO branch: PN-NEW Rev - (Draft)
2. Release ECO: PN-NEW Rev A (Released)
```


## Data Model

### Key Tables

```
designs
├── id, name, identifier
├── programId (permission boundary)
└── defaultBranchId (main branch)

branches
├── id, designId, name
├── branchType (main, eco, workspace)
├── headCommitId (latest commit)
├── baseCommitId (where branch started)
├── changeOrderItemId (for eco branches)
└── isArchived

commits
├── id, designId, branchId
├── parentId, mergeParentId
├── message
├── itemsChanged, itemsAdded, itemsDeleted
├── changeOrderItemId (for merge commits)
└── revisionsAssigned (JSON map)

tags
├── id, designId, name
├── commitId (points to)
└── tagType

branchItems
├── branchId, itemMasterId
├── currentItemId, baseItemId
├── changeType
└── checkedOutBy, checkedOutAt

itemVersions (audit log)
├── commitId, itemId
├── changeType
└── previousItemId
```

### Item Table Fields

Items have versioning-related fields:

```typescript
item: {
  id: 'unique-version-id',
  masterId: 'shared-across-revisions',  // Groups all revisions
  itemNumber: 'PN-001',
  revision: 'B',
  designId: 'design-id',               // Version container
  commitId: 'commit-id',               // When this version was created
  state: 'Released',
  isCurrent: true,                     // Latest revision flag
}
```


## Comparing to Traditional PLM

| Aspect | Traditional PLM | Cascadia |
|--------|-----------------|----------|
| Work isolation | Lock item for editing | Branch per ECO |
| Parallel ECOs | Must serialize | Work simultaneously |
| ECO cancellation | Manual cleanup | Delete branch |
| Revision timing | On checkout | On merge to main |
| History | Linear per item | DAG with merge commits |
| Time travel | Limited | Full (commits, tags) |
| Audit trail | Action log | Commit history |


## Communicating with Engineers

When explaining to traditional PLM users, use these analogies:

| Cascadia Term | Engineering Equivalent |
|---------------|----------------------|
| Design | Project or Product |
| Branch | Red-line set / Working copy |
| Commit | Checkpoint / Save point |
| Main branch | Official released drawings |
| ECO branch | Change package working folder |
| Merge | Release / Incorporate changes |
| Tag | Baseline / Snapshot |
| Checkout | Check out for edit |


## Key Files

| Concept | File |
|---------|------|
| Version resolution | `src/lib/services/VersionResolver.ts` |
| Branch management | `src/lib/services/BranchService.ts` |
| Commit operations | `src/lib/services/CommitService.ts` |
| Item checkout | `src/lib/services/CheckoutService.ts` |
| ECO release/merge | `src/lib/services/EcoReleaseService.ts` |
| Design management | `src/lib/services/DesignService.ts` |
| Schema definitions | `src/lib/db/schema/versioning.ts` |


## Edge Cases

### Concurrent ECO Conflicts

If ECO-001 and ECO-002 both modify PN-001:
- Both can work in parallel on their branches
- Whichever releases first gets the next revision (B)
- The second ECO must either:
  - Rebase on the new revision
  - Accept merge (if changes don't conflict)

Currently, Cascadia uses last-write-wins for simple cases. Complex merge conflict resolution is on the roadmap.


### Items Without Designs

Items can exist without a `designId` for:
- Legacy imported data
- Standalone items (rare)
- Templates

These items don't participate in versioning and use the traditional linear revision model.


### Branch Protection

Main branch is protected:
- Cannot checkout items directly on main
- Cannot create items directly on main (except initial setup)
- All changes must come through ECO merge

Exception: System operations can bypass via `{ bypassBranchProtection: true }`.


## See Also

- [Service Patterns](./service-patterns) - Using versioning services
- [Change Orders](/user-guide/change-orders) - User guide for ECOs
- [Architecture](./architecture) - Overall system design
