---
sidebar_position: 5
title: Runtime Configuration
---

# Runtime Configuration

The registry supports a **hybrid code-first + runtime configuration** pattern for enterprise deployments.

## Overview

**Code defines** (requires deployment):
- Database schemas
- Zod validation
- React components
- Table mappings

**Runtime overrides** (no deployment needed):
- Labels
- Permissions
- Lifecycle states
- Relationships

## Usage

```typescript
// Get merged config (runtime overrides code defaults)
const partConfig = ItemTypeRegistry.getType('Part')

// Hot-reload after database changes
await ItemTypeRegistry.reload()
```

## Configuration Storage

Runtime configurations are stored in the `item_type_configs` table and can be managed through:
- Admin API endpoints at `/api/admin/item-type-configs`
- Admin UI at `/admin/item-types/`

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/db/schema/config.ts` | `item_type_configs` table schema |
| `src/lib/config/ConfigService.ts` | CRUD operations for runtime configs |
| `src/routes/api/admin/item-type-configs.ts` | Admin API endpoints |
