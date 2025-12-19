---
sidebar_position: 2
title: Architecture
---

# Architecture Overview

Cascadia PLM is a code-first Product Lifecycle Management system built with modern TypeScript technologies.

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | TanStack Start (full-stack TypeScript) |
| **Database** | PostgreSQL 18+ with Drizzle ORM |
| **UI** | Tailwind CSS 4 + Radix UI |
| **Auth** | @oslojs/crypto + Arctic (OAuth) |
| **Validation** | TanStack Form + Zod |
| **Testing** | Vitest + Playwright |

## Core Concepts

### Item Type Registry Pattern

All item types (Part, Document, ChangeOrder, etc.) follow a registry pattern:

1. Extend the `BaseItem` interface
2. Define a Zod schema for validation
3. Register configuration (UI components, permissions, metadata)
4. Share a common `items` table + type-specific tables

```typescript
// Example item type registration
const partConfig: ItemTypeConfig = {
  type: 'Part',
  schema: partSchema,
  icon: CubeIcon,
  color: 'blue',
  permissions: ['read', 'create', 'update', 'delete'],
  table: parts,
}
```

### Two-Table Pattern

Each item type has:
- **Base record** in `items` table (id, masterId, itemNumber, revision, state)
- **Type-specific record** in dedicated table (parts, documents, etc.) linked via `itemId`

```
┌─────────────────┐         ┌─────────────────┐
│     items       │         │     parts       │
├─────────────────┤         ├─────────────────┤
│ id              │◄────────│ itemId (FK)     │
│ itemNumber      │         │ makeBuy         │
│ revision        │         │ unitOfMeasure   │
│ state           │         │ leadTime        │
│ masterId        │         │ ...             │
└─────────────────┘         └─────────────────┘
```

### Service Layer

Business logic is centralized in service classes:

**Item Services:**
- `ItemService` - Type-agnostic CRUD for all items
- `ChangeOrderService` - Change order lifecycle
- `ImpactAssessmentService` - Change impact analysis

**Infrastructure Services:**
- `FileService` - Vault operations
- `UserService` - User management
- `PermissionService` - RBAC permissions
- `ConfigService` - Runtime configuration

## Organizational Hierarchy

```
Organization
└── Program (permission boundary)
    └── Design (version container)
        └── Items (Part, Document, etc.)
```

- **Organization**: Top-level tenant
- **Program**: Business initiative/contract, permission boundary
- **Design**: Version container for items (maps to SysML Project)

## Authentication System

Session-based auth with middleware support:

```typescript
// In API routes
const { user } = await requireAuth(request)

// With permission check
await requirePermission(request, 'Part', 'create')
```

## File Vault System

The vault provides:
- Abstracted storage (local filesystem, S3-compatible)
- Check-in/check-out workflow
- Version tracking
- Metadata management

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/lib/items/` | Item type system and registry |
| `src/lib/db/schema/` | Database schemas (Drizzle) |
| `src/lib/auth/` | Authentication and permissions |
| `src/lib/vault/` | File storage system |
| `src/routes/api/` | API endpoints |
| `src/components/` | React components |

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI Route   │────▶│  API Route   │────▶│   Service    │
│  (React)     │     │  (Handler)   │     │   Layer      │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Response   │◀────│   Drizzle    │◀────│  PostgreSQL  │
│   (JSON)     │     │    ORM       │     │   Database   │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Next Steps

- [Code Conventions](/development/code-conventions) - Coding standards
- [Adding Item Types](/development/adding-item-types) - Extend the system
- [Testing](/development/testing) - Test infrastructure
