---
sidebar_position: 2.7
title: Database Patterns
---

# Database Patterns

Cascadia uses PostgreSQL with Drizzle ORM. This guide covers the schema organization, key patterns, and common query techniques.

## Schema Organization

Schema files are located in `src/lib/db/schema/`:

| File | Contents |
|------|----------|
| `items.ts` | Core item tables: items, parts, documents, change_orders, requirements, tasks, relationships |
| `versioning.ts` | Git-style versioning: designs, branches, commits, tags, branchItems, itemVersions |
| `programs.ts` | Organization: programs, program_members |
| `users.ts` | Auth: users, roles, user_roles, sessions, auth_events |
| `workflows.ts` | State machines: workflow_definitions, workflow_instances, workflow_history |
| `vault.ts` | File storage: vault_files, vault_file_history |
| `config.ts` | Runtime config: item_type_configs |
| `settings.ts` | App settings: settings |


## The Two-Table Pattern

Every item type follows a two-table pattern:

1. **Base record** in `items` table - common fields shared by all item types
2. **Type-specific record** in dedicated table - fields unique to that item type

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│          items              │         │          parts              │
├─────────────────────────────┤         ├─────────────────────────────┤
│ id (PK)                     │◄────────│ itemId (PK, FK)             │
│ masterId                    │         │ description                 │
│ itemNumber                  │         │ makeBuy                     │
│ revision                    │         │ material                    │
│ itemType = 'Part'           │         │ weight                      │
│ name                        │         │ cost                        │
│ state                       │         │ leadTimeDays                │
│ designId                    │         └─────────────────────────────┘
│ isCurrent                   │
│ createdBy, modifiedBy       │
└─────────────────────────────┘
```

### Why Two Tables?

1. **Unified queries**: List all items regardless of type with one query
2. **Shared behavior**: Common operations (revise, search, workflow) work on all types
3. **Type-specific fields**: Each type only stores what it needs
4. **Referential integrity**: Relationships point to `items.id`, not type-specific IDs

### Type-Specific Tables

| Table | Primary Key | Key Fields |
|-------|-------------|------------|
| `parts` | `itemId` | description, makeBuy, material, weight, cost, leadTimeDays |
| `documents` | `itemId` | description, fileId, fileName, fileSize, mimeType, storagePath |
| `change_orders` | `itemId` | changeType, priority, reasonForChange, approvedBy, implementedAt |
| `requirements` | `itemId` | requirementType, priority, verificationMethod, status |
| `tasks` | `itemId` | description, assignee, dueDate, priority, status, programId |


## Key Item Fields

### Identity Fields

```typescript
items: {
  id: uuid,           // Unique ID for this specific version
  masterId: uuid,     // Groups all revisions of the same item
  itemNumber: string, // Human-readable identifier (e.g., 'PN-001')
  revision: string,   // Version letter (A, B, C, ...)
  itemType: string,   // 'Part', 'Document', 'ChangeOrder', etc.
}
```

**Important distinctions**:
- `id` is unique per row—each revision has its own `id`
- `masterId` is shared across revisions—`PN-001 Rev A` and `PN-001 Rev B` have the same `masterId`
- `itemNumber + revision` is unique (enforced by database constraint)

### State and Currency

```typescript
items: {
  state: string,      // Lifecycle state: 'Draft', 'Released', 'Obsolete', etc.
  isCurrent: boolean, // True for the latest revision only
}
```

When creating a new revision:
1. Set `isCurrent = false` on all existing revisions with the same `masterId`
2. Create new revision with `isCurrent = true`

### Versioning Fields

```typescript
items: {
  designId: uuid,     // Links to version container (Design)
  commitId: uuid,     // Links to specific commit snapshot (optional)
}
```

See [Versioning](./versioning) for details on Git-style versioning.

### Audit Fields

```typescript
items: {
  createdAt: timestamp,
  createdBy: uuid,     // References users.id
  modifiedAt: timestamp,
  modifiedBy: uuid,    // References users.id
  lockedBy: uuid,      // User who has item locked (null if unlocked)
  lockedAt: timestamp,
}
```


## Relationships

Item relationships are stored in the `item_relationships` table:

```typescript
itemRelationships: {
  id: uuid,
  sourceId: uuid,           // Parent item (references items.id)
  targetId: uuid,           // Child item (references items.id)
  relationshipType: string, // 'BOM', 'Reference', 'Dependency', etc.
  quantity: decimal,        // For BOM relationships
  findNumber: integer,      // BOM line number
  referenceDesignator: text,// Position identifier (e.g., 'R1', 'C2')
  metadata: jsonb,          // Additional relationship data
}
```

### Relationship Types

| Type | Use Case | Typical Fields Used |
|------|----------|---------------------|
| `BOM` | Bill of Materials | quantity, findNumber, referenceDesignator |
| `Reference` | Document references | metadata |
| `Dependency` | Requirements traceability | metadata |
| `Supersedes` | Revision chain | (none) |

### BOM Example

```typescript
// Assembly PN-100 contains 4x Part PN-001
{
  sourceId: 'assembly-id',    // PN-100
  targetId: 'component-id',   // PN-001
  relationshipType: 'BOM',
  quantity: 4,
  findNumber: 1,
}
```

### Querying Relationships

```typescript
import { eq, and } from 'drizzle-orm'
import { items, itemRelationships } from '@/lib/db/schema'

// Get BOM for an assembly
const bom = await db
  .select({
    relationship: itemRelationships,
    component: items,
  })
  .from(itemRelationships)
  .innerJoin(items, eq(itemRelationships.targetId, items.id))
  .where(and(
    eq(itemRelationships.sourceId, assemblyId),
    eq(itemRelationships.relationshipType, 'BOM')
  ))

// Get where-used (parents that use this item)
const whereUsed = await db
  .select({
    relationship: itemRelationships,
    parent: items,
  })
  .from(itemRelationships)
  .innerJoin(items, eq(itemRelationships.sourceId, items.id))
  .where(and(
    eq(itemRelationships.targetId, componentId),
    eq(itemRelationships.relationshipType, 'BOM')
  ))
```


## Versioning Tables

See [Versioning](./versioning) for conceptual background.

### designs

Version containers (maps to SysML Projects):

```typescript
designs: {
  id: uuid,
  name: string,
  identifier: string,      // Short code like 'PC-PROTO'
  programId: uuid,         // Permission boundary
  defaultBranchId: uuid,   // Main branch
}
```

### branches

Version streams:

```typescript
branches: {
  id: uuid,
  designId: uuid,
  name: string,            // 'main', 'eco/ECO-001', 'workspace/kai'
  branchType: string,      // 'main', 'eco', 'workspace'
  headCommitId: uuid,      // Latest commit on this branch
  baseCommitId: uuid,      // Where branch was created from
  changeOrderItemId: uuid, // For ECO branches, the associated ECO
  isArchived: boolean,
  isLocked: boolean,
}
```

### commits

Immutable snapshots:

```typescript
commits: {
  id: uuid,
  designId: uuid,
  branchId: uuid,
  parentId: uuid,          // Previous commit
  mergeParentId: uuid,     // Second parent for merge commits
  message: string,
  itemsAdded: integer,
  itemsChanged: integer,
  itemsDeleted: integer,
  changeOrderItemId: uuid, // For merge commits, the ECO being released
  revisionsAssigned: jsonb,// { 'PN-001': 'B', 'PN-002': 'C' }
}
```

### branchItems

Tracks item state per branch:

```typescript
branchItems: {
  id: uuid,
  branchId: uuid,
  itemMasterId: uuid,      // Which item (by master ID)
  currentItemId: uuid,     // Current version on this branch
  baseItemId: uuid,        // Version when branch was created
  changeType: string,      // 'added', 'modified', 'deleted', null
  checkedOutBy: uuid,
  checkedOutAt: timestamp,
}
```


## Common Query Patterns

### Basic CRUD

```typescript
import { eq, and, or, desc, ilike } from 'drizzle-orm'
import { db } from '@/lib/db'
import { items, parts } from '@/lib/db/schema'

// Find by ID
const item = await db
  .select()
  .from(items)
  .where(eq(items.id, itemId))
  .limit(1)
  .then(r => r.at(0))

// Find by item number (current revision)
const current = await db
  .select()
  .from(items)
  .where(and(
    eq(items.itemNumber, 'PN-001'),
    eq(items.isCurrent, true)
  ))
  .limit(1)

// Find by item number and specific revision
const revA = await db
  .select()
  .from(items)
  .where(and(
    eq(items.itemNumber, 'PN-001'),
    eq(items.revision, 'A')
  ))
  .limit(1)
```

### Joining Item + Type-Specific Data

```typescript
// Get part with full data
const partWithData = await db
  .select({
    item: items,
    part: parts,
  })
  .from(items)
  .innerJoin(parts, eq(items.id, parts.itemId))
  .where(eq(items.id, partId))
  .limit(1)

// Result: { item: {...}, part: {...} }
```

### Search with Filters

```typescript
import { ilike, or, and, eq, SQL } from 'drizzle-orm'

// Build dynamic where conditions
const conditions: SQL[] = []

if (itemType) {
  conditions.push(eq(items.itemType, itemType))
}

if (state) {
  conditions.push(eq(items.state, state))
}

if (search) {
  conditions.push(or(
    ilike(items.itemNumber, `%${search}%`),
    ilike(items.name, `%${search}%`)
  ))
}

// Only current revisions by default
conditions.push(eq(items.isCurrent, true))

const results = await db
  .select()
  .from(items)
  .where(and(...conditions))
  .orderBy(desc(items.modifiedAt))
  .limit(limit)
  .offset(offset)
```

### Get All Revisions of an Item

```typescript
const revisions = await db
  .select()
  .from(items)
  .where(eq(items.masterId, masterId))
  .orderBy(desc(items.revision))
```

### Insert with Returning

```typescript
const [newItem] = await db
  .insert(items)
  .values({
    masterId: crypto.randomUUID(),
    itemNumber: 'PN-001',
    revision: 'A',
    itemType: 'Part',
    name: 'My Part',
    state: 'Draft',
    isCurrent: true,
    designId: designId,
    createdBy: userId,
    modifiedBy: userId,
  })
  .returning()

// Then insert type-specific data
await db.insert(parts).values({
  itemId: newItem.id,
  description: 'Part description',
  makeBuy: 'make',
})
```

### Update with Returning

```typescript
const [updated] = await db
  .update(items)
  .set({
    name: 'Updated Name',
    modifiedAt: new Date(),
    modifiedBy: userId,
  })
  .where(eq(items.id, itemId))
  .returning()
```

### Upsert (Insert or Update)

```typescript
await db
  .insert(parts)
  .values({
    itemId: itemId,
    description: 'New description',
  })
  .onConflictDoUpdate({
    target: parts.itemId,
    set: {
      description: 'Updated description',
    },
  })
```


## Transaction Patterns

### Basic Transaction

```typescript
const result = await db.transaction(async (tx) => {
  // All operations in this block share a transaction
  
  const [item] = await tx.insert(items).values({...}).returning()
  
  await tx.insert(parts).values({
    itemId: item.id,
    ...
  })
  
  await tx.insert(itemRelationships).values({
    sourceId: parentId,
    targetId: item.id,
    relationshipType: 'BOM',
    quantity: 1,
  })
  
  return item
})
// Transaction commits if no error thrown
// Transaction rolls back on any error
```

### Creating a Revision (Transaction Example)

```typescript
const newRevision = await db.transaction(async (tx) => {
  // 1. Mark all existing revisions as not current
  await tx
    .update(items)
    .set({ isCurrent: false })
    .where(eq(items.masterId, masterId))
  
  // 2. Get existing item data
  const [existing] = await tx
    .select()
    .from(items)
    .where(eq(items.id, existingItemId))
  
  // 3. Create new revision
  const [newItem] = await tx
    .insert(items)
    .values({
      masterId: existing.masterId,
      itemNumber: existing.itemNumber,
      revision: newRevision,
      itemType: existing.itemType,
      name: existing.name,
      state: 'Draft',
      isCurrent: true,
      designId: existing.designId,
      createdBy: userId,
      modifiedBy: userId,
    })
    .returning()
  
  // 4. Copy type-specific data
  const [existingPart] = await tx
    .select()
    .from(parts)
    .where(eq(parts.itemId, existingItemId))
  
  if (existingPart) {
    await tx.insert(parts).values({
      itemId: newItem.id,
      ...existingPart,
      itemId: newItem.id, // Override the PK
    })
  }
  
  return newItem
})
```


## Index Usage

Key indexes defined in the schema:

| Table | Index | Purpose |
|-------|-------|---------|
| `items` | `idx_master_id` | Find all revisions |
| `items` | `idx_item_type_state` | Filter by type and state |
| `items` | `idx_current` | Find current revisions |
| `items` | `idx_item_design` | Filter by design |
| `items` | `unique(itemNumber, revision)` | Enforce uniqueness |
| `item_relationships` | `idx_source` | BOM lookups |
| `item_relationships` | `idx_target` | Where-used lookups |
| `branches` | `idx_branch_design` | Branches per design |
| `commits` | `idx_commit_branch` | Commits per branch |
| `branch_items` | `idx_branch_items_branch` | Items per branch |

### Query Optimization Tips

1. **Always filter by `isCurrent`** when showing lists to users
2. **Use `designId` filter** when working within a specific design
3. **Prefer `itemNumber + revision`** over scanning by name
4. **Use `.limit(1)`** when expecting single results


## Soft Deletes

Items support soft deletion:

```typescript
items: {
  isDeleted: boolean,
  deletedAt: timestamp,
  deletedBy: uuid,
}
```

### Querying with Soft Deletes

```typescript
// Exclude deleted items (default behavior)
const active = await db
  .select()
  .from(items)
  .where(and(
    eq(items.isCurrent, true),
    eq(items.isDeleted, false)  // or: isNull(items.deletedAt)
  ))

// Include deleted items (for admin views)
const all = await db
  .select()
  .from(items)
  .where(eq(items.isCurrent, true))
  // No isDeleted filter
```

### Soft Delete Implementation

```typescript
await db
  .update(items)
  .set({
    isDeleted: true,
    deletedAt: new Date(),
    deletedBy: userId,
  })
  .where(eq(items.id, itemId))
```


## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/db/index.ts` | Database connection |
| `src/lib/db/schema/*.ts` | Table definitions |
| `drizzle/schema.ts` | Generated schema (don't edit directly) |
| `drizzle/relations.ts` | Generated relations |
| `drizzle.config.ts` | Drizzle configuration |


## See Also

- [Versioning](./versioning) - Git-style versioning model
- [Service Patterns](./service-patterns) - Using services with database
- [Architecture](./architecture) - System overview
