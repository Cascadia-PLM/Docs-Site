---
sidebar_position: 2.5
title: Service Patterns
---

# Service Layer Patterns

Cascadia's business logic is centralized in service classes. This guide explains when and how to use each service, common patterns, and important gotchas.

## Service Overview

Services are organized into three categories:

| Category | Services | Purpose |
|----------|----------|---------|
| **Item Services** | ItemService, ChangeOrderService, ImpactAssessmentService | Item CRUD and lifecycle |
| **Versioning Services** | DesignService, BranchService, CommitService, CheckoutService, VersionResolver, EcoReleaseService | Git-style version control |
| **Infrastructure Services** | FileService, UserService, PermissionService, ConfigService | System operations |

## Item Services

### ItemService

**Location**: `src/lib/items/services/ItemService.ts`

**Purpose**: Type-agnostic CRUD operations for all item types.

**When to use**:
- Creating, reading, updating, or deleting any item type
- Revising an existing item
- Searching across item types
- Getting items at a specific version context

**Key methods**:

```typescript
// Create a new item
const part = await ItemService.create('Part', {
  itemNumber: 'PN-001',
  revision: 'A',
  name: 'Motor Bracket',
  designId: designId,
  state: 'Draft',
}, userId)

// Update an item
await ItemService.update(itemId, { name: 'Motor Bracket V2' }, userId)

// Create a new revision
const revB = await ItemService.revise(itemId, 'B', userId)

// Find by ID (with type-specific data merged)
const item = await ItemService.findById(itemId)

// Search with filters
const results = await ItemService.search({
  query: 'motor',
  state: 'Released',
  designId: designId,
  limit: 50,
})

// Get item at a specific version context
const oldVersion = await ItemService.getAtContext(
  masterId,
  designId,
  { type: 'commit', commitId: someCommitId }
)
```

**Important**: ItemService handles the two-table pattern automatically. It writes to both the `items` table and the appropriate type-specific table (e.g., `parts`, `documents`).


### ChangeOrderService

**Location**: `src/lib/items/services/ChangeOrderService.ts`

**Purpose**: Change order lifecycle management, affected items, and ECO implementation.

**When to use**:
- Adding/removing affected items from an ECO
- Moving ECO through workflow states (submit, approve, implement)
- Managing ECO-Design associations
- Implementing changes (releasing, revising, obsoleting items)

**Key methods**:

```typescript
// Add an affected item to an ECO
await ChangeOrderService.addAffectedItem(
  changeOrderId,
  {
    affectedItemId: partId,
    changeAction: 'revise',
    currentRevision: 'A',
    targetRevision: 'B',
    targetState: 'Released',
    changeDescription: 'Updated mounting holes',
  },
  userId
)

// ECO state transitions
await ChangeOrderService.submit(changeOrderId, userId)
await ChangeOrderService.approve(changeOrderId, userId)

// Implement changes (applies all affected item actions)
const result = await ChangeOrderService.implement(changeOrderId, userId)
// result.released: string[] - item numbers released
// result.obsoleted: string[] - item numbers obsoleted
// result.created: string[] - item numbers created
// result.revisionsCreated: Map<string, string> - old ID -> new ID

// Get ECO's affected items
const affectedItems = await ChangeOrderService.getAffectedItems(changeOrderId)

// Get designs associated with an ECO
const ecoDesigns = await ChangeOrderService.getEcoDesigns(changeOrderId)
```

**Change Actions**:

| Action | Description | Effect |
|--------|-------------|--------|
| `release` | First release | Item transitions to Released |
| `revise` | Create new revision | New revision created, original superseded |
| `obsolete` | End-of-life | Item transitions to Obsolete |
| `replace` | Swap items | Original obsoleted, replacement released |
| `add` | Create new item | Brand new item created |
| `remove` | Remove from assembly | BOM relationship removed |


### ImpactAssessmentService

**Location**: `src/lib/items/services/ImpactAssessmentService.ts`

**Purpose**: Analyze the impact of proposed changes.

**When to use**:
- Generating impact reports for ECOs
- Finding where-used relationships
- Calculating BOM depth and affected item counts

```typescript
// Generate impact report for an ECO
const report = await ImpactAssessmentService.generateReport(changeOrderId, userId)
```


## Versioning Services

See [Versioning](./versioning) for conceptual background.


### DesignService

**Location**: `src/lib/services/DesignService.ts`

**Purpose**: Manage version containers (Designs) and their branches/tags.

**When to use**:
- Creating a new Design (version container)
- Getting branches or tags for a Design
- Getting the default (main) branch

```typescript
// Create a new design
const design = await DesignService.create({
  name: 'Power Cart Prototype',
  identifier: 'PC-PROTO',
  programId: programId,
}, userId)

// Get design by ID
const design = await DesignService.getById(designId)

// Get main branch
const mainBranch = await DesignService.getDefaultBranch(designId)

// List branches
const branches = await DesignService.getBranches(designId)

// List tags
const tags = await DesignService.getTags(designId)
```


### BranchService

**Location**: `src/lib/services/BranchService.ts`

**Purpose**: Branch creation and management.

**When to use**:
- Creating ECO or workspace branches
- Getting branch by name
- Archiving branches after merge

```typescript
// Create an ECO branch (typically called automatically by ChangeOrderService)
const ecoBranch = await BranchService.create({
  designId: designId,
  name: 'eco/ECO-001',
  branchType: 'eco',
  baseCommitId: mainBranch.headCommitId,
  changeOrderItemId: ecoId,
}, userId)

// Get branch by name
const branch = await BranchService.getByName(designId, 'eco/ECO-001')

// Get main branch
const main = await BranchService.getMainBranch(designId)

// Archive after merge
await BranchService.archiveBranch(branchId)
```

**Branch types**:
- `main` - The released/production state
- `eco` - ECO work branches (e.g., `eco/ECO-001`)
- `workspace` - Personal work branches (e.g., `workspace/kai`)


### CommitService

**Location**: `src/lib/services/CommitService.ts`

**Purpose**: Create commits and query commit history.

**When to use**:
- Creating commits when saving changes
- Creating merge commits (ECO release)
- Getting commit history for a branch or item

```typescript
// Create a commit
const commit = await CommitService.create({
  branchId: branchId,
  message: 'Updated motor mount dimensions',
  itemChanges: [
    { itemId: partId, changeType: 'modified', previousItemId: oldPartId },
  ],
}, userId)

// Create merge commit (ECO release)
const mergeCommit = await CommitService.createMergeCommit({
  targetBranchId: mainBranchId,
  sourceBranchId: ecoBranchId,
  message: 'Merge ECO-001: Motor mount redesign',
  changeOrderItemId: ecoId,
  revisionsAssigned: { 'PN-001': 'B', 'PN-002': 'B' },
  itemChanges: [...],
}, userId)

// Get commit history
const history = await CommitService.getHistory(branchId, {
  limit: 50,
  offset: 0,
})

// Get specific commit
const commit = await CommitService.getById(commitId)
```


### CheckoutService

**Location**: `src/lib/services/CheckoutService.ts`

**Purpose**: Item checkout/checkin on branches.

**When to use**:
- Checking out an item for editing on a branch
- Checking in changes
- Getting checkout status

```typescript
// Checkout item to a branch
const branchItem = await CheckoutService.checkout({
  itemMasterId: item.masterId,
  branchId: ecoBranchId,
}, userId)

// Get checkout status
const status = await CheckoutService.getCheckoutStatus(itemMasterId, branchId)
// status.isCheckedOut: boolean
// status.checkedOutBy: { id, name, email }
// status.checkedOutAt: Date

// Save changes (creates new item version + commit)
const result = await CheckoutService.saveChanges({
  branchId: branchId,
  itemId: currentItemId,
  changes: { name: 'Updated Part Name' },
  commitMessage: 'Renamed part for clarity',
}, userId)

// Checkin (releases lock)
await CheckoutService.checkin(branchItemId, userId)
```

**Rules**:
- Cannot checkout on main branch
- Only one user can checkout an item at a time per branch
- Checkout creates a `branchItems` record that tracks changes


### VersionResolver

**Location**: `src/lib/services/VersionResolver.ts`

**Purpose**: Resolve items at different version contexts.

**When to use**:
- Getting an item as it existed at a specific commit/tag/branch
- Listing all items at a version context
- Parsing version context from URL parameters

```typescript
// Parse context from URL params
const context = VersionResolver.parseContext({
  designId: designId,
  branch: 'eco/ECO-001',  // or commit/tag
})

// Resolve branch name to context
const context = await VersionResolver.resolveBranchContext(designId, 'eco/ECO-001')

// Get item at context
const item = await VersionResolver.getItemAtContext(masterId, designId, context)

// Get all items at context
const items = await VersionResolver.getItemsAtContext(designId, context, {
  itemType: 'Part',
  state: 'Released',
  limit: 100,
})

// Get context description for display
const desc = await VersionResolver.getContextDescription(context)
// e.g., "Branch: eco/ECO-001" or "Tag: Prototype v0.1"
```

**Version context types**:

```typescript
type VersionContext =
  | { type: 'released'; designId: string }  // main branch HEAD
  | { type: 'branch'; branchId: string }    // any branch HEAD  
  | { type: 'commit'; commitId: string }    // specific commit
  | { type: 'tag'; tagId: string }          // tag's commit
```


### EcoReleaseService

**Location**: `src/lib/services/EcoReleaseService.ts`

**Purpose**: ECO merge/release workflow with revision assignment.

**When to use**:
- Releasing an approved ECO (merging branches to main)
- Previewing what a release will do
- Validating that a merge is possible

```typescript
// Preview what release will do
const preview = await EcoReleaseService.previewRelease(changeOrderId, userId)
// preview.designs: Array<{ designId, items: Array<{ itemNumber, currentRevision, newRevision, changeType }> }>
// preview.canRelease: boolean
// preview.validationIssues: string[]

// Validate merge is possible
const validation = await EcoReleaseService.validateMerge(branchId)
// validation.canMerge: boolean
// validation.conflicts: Array<{ itemId, itemNumber, reason }>
// validation.warnings: string[]

// Release the ECO (main entry point)
const result = await EcoReleaseService.releaseEco(changeOrderId, userId)
// result.designs: Array<{ designId, designName, mergeResult }>
// result.totalRevisionsAssigned: number

// Low-level: merge a single branch to main
const mergeResult = await EcoReleaseService.mergeBranchToMain(branchId, changeOrderId, userId)
// mergeResult.mergeCommit
// mergeResult.revisionsAssigned: Record<string, string>
// mergeResult.itemsMerged, itemsAdded, itemsDeleted
```


## Infrastructure Services

### FileService

**Location**: `src/lib/vault/services/FileService.ts`

**Purpose**: Vault file operations including upload, download, and check-out/check-in.

**When to use**:
- Uploading files to items
- Downloading files
- File check-out/check-in (locking)
- Getting file history

```typescript
// Upload a file
const file = await FileService.uploadFile({
  itemId: itemId,
  file: buffer,
  metadata: {
    originalFileName: 'bracket.sldprt',
    mimeType: 'application/octet-stream',
  },
  uploadedBy: userId,
})

// Download a file
const buffer = await FileService.downloadFile(fileId, userId)

// Check out file (lock for editing)
await FileService.checkOutFile(fileId, userId)

// Check in file (unlock, optionally with new version)
await FileService.checkInFile(fileId, userId, newBuffer, newMetadata)

// Get file metadata
const metadata = await FileService.getFileMetadata(fileId)

// Get files for an item
const files = await FileService.getFilesForItem(itemId)
```


## Common Patterns

### Transaction Boundaries

Services handle their own transactions. For complex operations spanning multiple services, wrap in a transaction:

```typescript
import { db } from '@/lib/db'

const result = await db.transaction(async (tx) => {
  // Multiple service calls share the transaction
  const item = await ItemService.create('Part', data, userId)
  await RelationshipService.create({ sourceId: parentId, targetId: item.id, ... })
  return item
})
```

### Error Handling

Services throw typed errors from `src/lib/errors/`:

```typescript
import { NotFoundError, ValidationError, PermissionDeniedError } from '@/lib/errors'

try {
  await ItemService.findById(itemId)
} catch (error) {
  if (error instanceof NotFoundError) {
    // Item doesn't exist
  } else if (error instanceof ValidationError) {
    // Invalid data
  } else if (error instanceof PermissionDeniedError) {
    // User lacks permission
  }
}
```


### Bypass Options

Some operations support bypass flags for system operations:

```typescript
// ECO release bypasses branch protection since it's authorized by the ECO approval
await ItemService.update(itemId, { state: 'Released' }, userId, {
  bypassBranchProtection: true
})
```


## Service Selection Guide

| I want to... | Use this service |
|--------------|------------------|
| Create/update/delete any item | `ItemService` |
| Add affected items to an ECO | `ChangeOrderService` |
| Release an approved ECO | `EcoReleaseService.releaseEco()` |
| Checkout an item for editing | `CheckoutService.checkout()` |
| Get an item at a specific point in time | `VersionResolver.getItemAtContext()` |
| Create a new Design/Project | `DesignService.create()` |
| Create a branch | `BranchService.create()` |
| Record changes in a commit | `CommitService.create()` |
| Upload/download files | `FileService` |
| Generate impact analysis | `ImpactAssessmentService` |


## Key Files Reference

| Service | File Path |
|---------|-----------|
| ItemService | `src/lib/items/services/ItemService.ts` |
| ChangeOrderService | `src/lib/items/services/ChangeOrderService.ts` |
| ImpactAssessmentService | `src/lib/items/services/ImpactAssessmentService.ts` |
| DesignService | `src/lib/services/DesignService.ts` |
| BranchService | `src/lib/services/BranchService.ts` |
| CommitService | `src/lib/services/CommitService.ts` |
| CheckoutService | `src/lib/services/CheckoutService.ts` |
| VersionResolver | `src/lib/services/VersionResolver.ts` |
| EcoReleaseService | `src/lib/services/EcoReleaseService.ts` |
| FileService | `src/lib/vault/services/FileService.ts` |


## See Also

- [Versioning](./versioning) - Git-style versioning concepts
- [Architecture](./architecture) - System architecture overview
- [Adding Item Types](./adding-item-types) - Extending the system
