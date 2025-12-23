---
sidebar_position: 2
title: Architecture
---

# Architecture Overview

Cascadia PLM is a code-first Product Lifecycle Management system. This document provides a mental model of the system architecture and explains key design decisions.

> **Detailed guides**: For implementation specifics, see [Service Patterns](./service-patterns), [Git-Style Versioning](./versioning), and [Database Patterns](./database-patterns).


## System Mental Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Cascadia PLM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│   │    Parts    │    │  Documents  │    │   Change    │    │Requirements │  │
│   │             │    │             │    │   Orders    │    │   & Tasks   │  │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│          │                  │                  │                  │         │
│          └──────────────────┴────────┬─────────┴──────────────────┘         │
│                                      │                                       │
│                            ┌─────────▼─────────┐                            │
│                            │   Item Registry   │  ← Unified item system     │
│                            │   & Services      │                            │
│                            └─────────┬─────────┘                            │
│                                      │                                       │
│          ┌───────────────────────────┼───────────────────────────┐          │
│          │                           │                           │          │
│   ┌──────▼──────┐           ┌────────▼────────┐         ┌────────▼────────┐ │
│   │  Versioning │           │    Workflows    │         │   File Vault    │ │
│   │  (Git-style)│           │   & Lifecycles  │         │                 │ │
│   └─────────────┘           └─────────────────┘         └─────────────────┘ │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                           PostgreSQL Database                                │
└─────────────────────────────────────────────────────────────────────────────┘
```


## Technology Stack

| Layer | Technology | Why This Choice |
|-------|------------|-----------------|
| **Framework** | TanStack Start | Full-stack TypeScript, file-based routing, excellent DX |
| **Database** | PostgreSQL 18+ | ACID compliance, JSON support, proven at scale |
| **ORM** | Drizzle | Type-safe, SQL-like syntax, great migrations |
| **UI** | Tailwind + Radix | Utility-first CSS, accessible components |
| **Validation** | Zod | Runtime validation with TypeScript inference |
| **Auth** | Oslo.js + Arctic | Modern crypto, OAuth support, no magic |
| **Testing** | Vitest + Playwright | Fast unit tests, reliable E2E |


## Core Design Decisions

### 1. Code-First Configuration

**Decision**: All customization happens in TypeScript code, not UI configuration.

**Why**:
- Version controlled with Git
- Full IDE support (autocomplete, refactoring, type checking)
- No hidden configuration in database
- Deployments are reproducible
- Easier to review changes in PRs

**Trade-off**: Less accessible to non-developers, but PLM customization typically requires developer skills anyway.


### 2. Two-Table Pattern for Items

**Decision**: Every item type has a base record in `items` plus type-specific fields in a dedicated table.

```
items (base)              parts (type-specific)
├── id                    ├── itemId (FK) ─────┐
├── masterId              ├── makeBuy           │
├── itemNumber            ├── material          │
├── revision              └── weight            │
├── state                                       │
└── ...                   ◄─────────────────────┘
```

**Why**:
- Unified queries across all item types ("show me all items in Review state")
- Common operations work on any item (revise, transition, search)
- Type-specific tables stay focused and small
- Relationships point to `items.id`, not type-specific IDs

**Learn more**: [Database Patterns](./database-patterns#the-two-table-pattern)


### 3. Git-Style Versioning

**Decision**: Use branches and commits instead of linear revision sequences.

```
Traditional PLM:     PN-001: A → B → C → D (linear, blocking)

Cascadia:           main:     [A] ────────── [B] ────── [C]
                               │              ↑          ↑
                    eco/ECO-1: └──[work]─────┘          │
                    eco/ECO-2: ──────────[work]─────────┘
```

**Why**:
- Multiple ECOs can work on the same part simultaneously
- ECO cancellation is clean (just delete the branch)
- Changes are grouped by purpose (ECO), not just "next revision"
- Complete history with merge commits
- Revision letters assigned only on merge (release)

**Trade-off**: More complex than linear revisions, but solves real workflow problems.

**Learn more**: [Git-Style Versioning](./versioning)


### 4. Service Layer Pattern

**Decision**: All business logic in service classes, not in routes or components.

```
Route (thin)          Service (business logic)       Database
     │                        │                          │
     │  validate request      │                          │
     │  ──────────────────►   │                          │
     │                        │  complex logic           │
     │                        │  ──────────────────────► │
     │                        │  ◄────────────────────── │
     │  ◄──────────────────   │                          │
     │  return response       │                          │
```

**Why**:
- Routes stay thin and focused on HTTP concerns
- Business logic is testable without HTTP
- Services can call other services
- Easier to understand "where does X happen?"

**Learn more**: [Service Patterns](./service-patterns)


### 5. Program-Based Permissions

**Decision**: Users belong to Programs, which control what they can access.

```
Organization (tenant)
└── Program A (permission boundary)
│   ├── Design 1
│   │   └── Parts, Documents, etc.
│   └── Design 2
└── Program B (separate boundary)
    └── Design 3
```

**Why**:
- Natural fit for contract-based work (defense, aerospace)
- Clear data isolation between programs
- Users can belong to multiple programs
- Simpler than item-level ACLs for most use cases


### 6. Workflow Definitions as Data

**Decision**: Workflows and lifecycles are defined as JSON structures in the database, not hardcoded.

**Why**:
- Different item types can share lifecycle definitions
- Admins can modify workflows without code deployment
- Workflow history is tied to the definition version
- Supports approval voting, guards, and effects

**Trade-off**: More complex than hardcoded states, but necessary for enterprise flexibility.


## Directory Structure

```
src/
├── lib/
│   ├── items/              # Item type system
│   │   ├── registry.ts     # Central registry
│   │   ├── types/          # Type definitions and schemas
│   │   └── services/       # ItemService, ChangeOrderService
│   │
│   ├── services/           # Versioning services
│   │   ├── DesignService.ts
│   │   ├── BranchService.ts
│   │   ├── CommitService.ts
│   │   ├── CheckoutService.ts
│   │   └── VersionResolver.ts
│   │
│   ├── db/
│   │   ├── index.ts        # Database connection
│   │   └── schema/         # Drizzle table definitions
│   │
│   ├── auth/               # Authentication
│   │   ├── session.ts      # Session management
│   │   ├── password.ts     # Password hashing
│   │   └── server.ts       # Route helpers
│   │
│   └── vault/              # File storage
│       └── services/
│
├── routes/
│   ├── api/                # API endpoints
│   └── (app)/              # UI routes
│
└── components/
    ├── ui/                 # Base components
    └── items/              # Item-specific components
```


## Data Flow

### Read Path (e.g., viewing a part)

```
1. Browser requests /parts/[id]
2. UI route loads, calls API
3. API route: requireAuth() → requirePermission()
4. ItemService.findById() called
5. Drizzle queries items + parts tables
6. Merged result returned to UI
7. React renders PartDetail component
```

### Write Path (e.g., ECO release)

```
1. User clicks "Release ECO" button
2. API route receives POST request
3. requirePermission('ChangeOrder', 'update')
4. EcoReleaseService.releaseEco() called
5. Transaction begins:
   a. Validate ECO is approved
   b. For each affected design:
      - Merge ECO branch to main
      - Assign revision letters
      - Create merge commit
      - Archive ECO branch
   c. Update ECO state to Implemented
6. Transaction commits
7. Success response returned
```


## Integration Points

### External Systems

| Integration | Method | Status |
|-------------|--------|--------|
| **SolidWorks** | Desktop add-in (C#) | In progress |
| **SysML 2.0** | REST API at `/api/sysml/*` | Complete |
| **ERP Systems** | Planned webhook events | Future |
| **SSO/SAML** | Arctic OAuth providers | Supported |

### Extension Patterns

**Adding a new item type**: Define schema, create type file, register in registry.
See [Adding Item Types](./adding-item-types).

**Custom workflow actions**: Add action handlers to workflow definition.

**External triggers**: API endpoints accept webhooks for external events.


## Key Architectural Boundaries

### Client vs Server

```
Client (Browser)                    Server (Node.js)
─────────────────                   ─────────────────
React components                    API routes
TanStack Router                     Services
Form state                          Database access
Local validation                    Authoritative validation
                    │
                    │ HTTP/JSON
                    ▼
```

**Rule**: Database code never runs in the browser. Use `.server.ts` suffix or dynamic imports for server-only code.

### Item Types vs Services

```
Item Types (data shape)             Services (behavior)
───────────────────────             ───────────────────
Zod schemas                         Business logic
Type-specific fields                State transitions
UI components                       Cross-type operations
Registry config                     Database transactions
```

**Rule**: Services are type-agnostic where possible. `ItemService.create('Part', data)` works for any registered type.


## Performance Considerations

### Database

- **Indexes**: Key queries have covering indexes (see [Database Patterns](./database-patterns#index-usage))
- **Pagination**: All list endpoints support `limit`/`offset`
- **Soft deletes**: Deleted items excluded from queries by default

### Caching

- **Session cache**: Sessions cached in memory with DB fallback
- **Registry cache**: Item type configs cached after first load
- **No query cache**: Drizzle queries hit DB directly (PostgreSQL handles caching)

### Bundle Size

- **Code splitting**: Routes are lazy-loaded
- **Server components**: Heavy logic stays server-side
- **Tree shaking**: Unused code eliminated in production build


## Further Reading

| Topic | Document |
|-------|----------|
| Using services | [Service Patterns](./service-patterns) |
| Branching and commits | [Git-Style Versioning](./versioning) |
| Schema and queries | [Database Patterns](./database-patterns) |
| Coding standards | [Code Conventions](./code-conventions) |
| Extending the system | [Adding Item Types](./adding-item-types) |
| Test infrastructure | [Testing](./testing) |
