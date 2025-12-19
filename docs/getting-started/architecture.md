---
sidebar_position: 4
title: Architecture
---

# Architecture Overview

Cascadia PLM is built on a modern, type-safe architecture designed for extensibility and maintainability.

## Core Architecture

### Item Type Registry Pattern

The system uses a **Registry Pattern** for managing different item types. All item types:

1. Extend the `BaseItem` interface (`src/lib/items/types/base.ts`)
2. Have a Zod schema for validation
3. Register their configuration including UI components, permissions, and metadata
4. Share a common `items` table for base fields + type-specific tables for additional fields

```typescript
// Register a new item type
ItemTypeRegistry.register({
  name: 'Part',
  label: 'Part',
  table: 'parts',
  schema: partSchema,
  components: { form, table, detail },
  permissions: { create: ['Engineer'], read: ['*'] }
})

// Use registered types
const typeConfig = ItemTypeRegistry.getType('Part')
```

### Database Schema Pattern

**Two-Table Pattern**: Each item type has:
- Base record in `items` table (id, masterId, itemNumber, revision, state, etc.)
- Type-specific record in dedicated table (parts, documents, change_orders, requirements, tasks) linked via `itemId`

**Git-Style Versioning** (SysML Migration):
- `designId` on items - Links item to version container
- `commitId` on items - Links to specific commit snapshot
- Branches (main, eco/*, workspace/*) - Version streams
- Commits - Immutable snapshots with parent chain
- Tags - Named baselines pointing to commits

### Service Layer Pattern

Business logic is centralized in service classes:

**Item Services**:
- `ItemService` - Type-agnostic CRUD for all items
- `ChangeOrderService` - Change order lifecycle
- `ImpactAssessmentService` - Change impact analysis

**Versioning Services**:
- `DesignService` - Design CRUD, branches, tags
- `BranchService` - Branch creation and management
- `CommitService` - Commit creation and history
- `CheckoutService` - Item checkout/checkin
- `VersionResolver` - Resolve items at version context

**Infrastructure Services**:
- `FileService` - File vault operations
- `UserService` - User management
- `PermissionService` - RBAC permissions
- `ConfigService` - Runtime item type configuration

### Authentication System

Session-based auth with full middleware support:
- PBKDF2 password hashing via @oslojs/crypto
- SessionManager for session lifecycle
- Request auth helpers (`requireAuth`, `requirePermission`, `requireRole`)
- Sessions stored in database with expiry and auto-extension

### File Vault System

The vault system provides:
- Abstracted storage (local filesystem, S3-compatible)
- File check-in/check-out workflow
- Version tracking per file
- Metadata management

## TanStack Start Routing

- File-based routing in `src/routes/`
- API routes use `createFileRoute()` with `server.handlers`
- UI routes use `createFileRoute()` with component exports
- Route parameters: `$id` notation (e.g., `parts/$id.tsx`)

## Key Schema Files

Located in `src/lib/db/schema/`:

| File | Contents |
|------|----------|
| `items.ts` | Items, parts, documents, change orders, requirements, tasks, relationships |
| `designs.ts` | Designs (version containers), branches, commits, tags |
| `programs.ts` | Programs (permission boundaries), program members |
| `users.ts` | Users, roles, sessions, auth events |
| `workflows.ts` | Workflow definitions, instances, history |
| `vault.ts` | File vault storage |
| `settings.ts` | Application settings |
| `config.ts` | Runtime item type configurations |

## Next Steps

- [Code Conventions](/development/code-conventions) - Coding standards
- [Adding Item Types](/development/adding-item-types) - Extend the system
- [Testing Guide](/development/testing) - Testing strategies
