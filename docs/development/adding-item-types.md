---
sidebar_position: 5
title: Adding Item Types
---

# Adding Item Types

Extend Cascadia with custom item types using the Registry Pattern.

## Overview

All item types in Cascadia follow the same pattern:
1. Define TypeScript interface and Zod schema
2. Create database table
3. Build UI components
4. Register the type
5. Create routes

## Step-by-Step Guide

### 1. Create Type Definition

Create `src/lib/items/types/widget.ts`:

```typescript
import { z } from 'zod'
import { baseItemSchema, type BaseItem } from './base'

// TypeScript interface
export interface Widget extends BaseItem {
  type: 'Widget'
  widgetColor: string
  widgetSize: number
  isActive: boolean
}

// Zod schema
export const widgetSchema = baseItemSchema.extend({
  type: z.literal('Widget'),
  widgetColor: z.string().min(1, 'Color is required'),
  widgetSize: z.number().min(1).max(100),
  isActive: z.boolean().default(true),
})

// Create/update schema (without base fields)
export const widgetCreateSchema = widgetSchema.omit({
  id: true,
  masterId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
})
```

### 2. Add Database Schema

Update `src/lib/db/schema/items.ts`:

```typescript
export const widgets = pgTable('widgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: uuid('item_id')
    .notNull()
    .references(() => items.id, { onDelete: 'cascade' }),
  widgetColor: varchar('widget_color', { length: 50 }).notNull(),
  widgetSize: integer('widget_size').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const widgetsRelations = relations(widgets, ({ one }) => ({
  item: one(items, {
    fields: [widgets.itemId],
    references: [items.id],
  }),
}))
```

Generate and apply migration:

```bash
npm run db:generate
npm run db:push
```

### 3. Create UI Components

**Form Component** (`src/components/widgets/WidgetForm.tsx`):

```typescript
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { widgetCreateSchema } from '@/lib/items/types/widget'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function WidgetForm({ onSubmit, defaultValues }) {
  const form = useForm({
    defaultValues: {
      itemNumber: '',
      name: '',
      widgetColor: '',
      widgetSize: 1,
      isActive: true,
      ...defaultValues,
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: widgetCreateSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      <form.Field name="itemNumber">
        {(field) => (
          <Input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder="Item Number"
          />
        )}
      </form.Field>
      {/* Add more fields */}
      <Button type="submit">Save</Button>
    </form>
  )
}
```

**Table Component** (`src/components/widgets/WidgetTable.tsx`):

```typescript
import { DataGrid } from '@/components/ui/data-grid'
import type { Widget } from '@/lib/items/types/widget'

const columns = [
  { accessorKey: 'itemNumber', header: 'Item Number' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'widgetColor', header: 'Color' },
  { accessorKey: 'widgetSize', header: 'Size' },
  { accessorKey: 'state', header: 'State' },
]

export function WidgetTable({ widgets }: { widgets: Widget[] }) {
  return <DataGrid data={widgets} columns={columns} />
}
```

### 4. Register the Type

**Server Registration** (`src/lib/items/registerItemTypes.server.ts`):

```typescript
import { widgets } from '@/lib/db/schema/items'
import { widgetSchema, widgetCreateSchema } from './types/widget'

ItemTypeRegistry.register({
  type: 'Widget',
  schema: widgetSchema,
  createSchema: widgetCreateSchema,
  table: widgets,
  itemIdColumn: 'itemId',
  permissions: {
    read: ['User', 'Administrator'],
    create: ['User', 'Administrator'],
    update: ['User', 'Administrator'],
    delete: ['Administrator'],
  },
  lifecycleStates: [
    { name: 'Draft', color: 'gray' },
    { name: 'Active', color: 'green' },
    { name: 'Obsolete', color: 'red' },
  ],
})
```

**Client Registration** (`src/lib/items/registerItemTypes.tsx`):

```typescript
import { CubeIcon } from '@heroicons/react/24/outline'
import { WidgetForm } from '@/components/widgets/WidgetForm'
import { WidgetTable } from '@/components/widgets/WidgetTable'

ItemTypeRegistry.registerUI('Widget', {
  icon: CubeIcon,
  color: 'purple',
  FormComponent: WidgetForm,
  TableComponent: WidgetTable,
})
```

### 5. Create Routes

**API Routes** (`src/routes/api/widgets.ts`):

```typescript
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { json } from '@tanstack/react-start'
import { requireAuth, requirePermission } from '@/lib/auth/server'
import { ItemService } from '@/lib/items/services/ItemService'

export const APIRoute = createAPIFileRoute('/api/widgets')({
  GET: async ({ request }) => {
    await requireAuth(request)
    const widgets = await ItemService.list('Widget')
    return json({ data: widgets })
  },

  POST: async ({ request }) => {
    const { user } = await requireAuth(request)
    await requirePermission(request, 'Widget', 'create')
    const body = await request.json()
    const widget = await ItemService.create('Widget', body, user.id)
    return json({ data: widget }, { status: 201 })
  },
})
```

**UI Routes** (`src/routes/widgets/index.tsx`):

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { WidgetTable } from '@/components/widgets/WidgetTable'

export const Route = createFileRoute('/widgets/')({
  component: WidgetsPage,
})

function WidgetsPage() {
  const widgets = Route.useLoaderData()

  return (
    <div>
      <h1>Widgets</h1>
      <WidgetTable widgets={widgets} />
    </div>
  )
}
```

### 6. Add Tests

Create `src/lib/items/types/widget.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { TestDatabase } from '@/__tests__/helpers/db'
import { ItemService } from '../services/ItemService'

describe('Widget Item Type', () => {
  const testDb = new TestDatabase()

  beforeAll(async () => {
    await testDb.setup()
  })

  afterAll(async () => {
    await testDb.teardown()
  })

  beforeEach(async () => {
    await testDb.beginTransaction()
  })

  afterEach(async () => {
    await testDb.rollback()
  })

  it('creates a widget with custom fields', async () => {
    const widget = await ItemService.create(
      'Widget',
      {
        itemNumber: 'WDG-001',
        revision: 'A',
        name: 'Test Widget',
        widgetColor: 'blue',
        widgetSize: 50,
      },
      userId
    )

    expect(widget.widgetColor).toBe('blue')
    expect(widget.widgetSize).toBe(50)
  })
})
```

## Item Type Configuration

```typescript
interface ItemTypeConfig {
  type: string                    // Unique identifier
  schema: ZodSchema              // Full validation schema
  createSchema: ZodSchema        // Create/update schema
  table: PgTable                 // Drizzle table
  itemIdColumn: string           // FK column name

  permissions: {
    read: Role[]
    create: Role[]
    update: Role[]
    delete: Role[]
  }

  lifecycleStates: Array<{
    name: string
    color: string
  }>

  // Optional
  relationships?: RelationshipConfig[]
  workflows?: WorkflowConfig[]
}
```

## Best Practices

1. **Extend BaseItem** - Always extend the base interfaces and schemas
2. **Use Transactions** - Multi-step operations should use `db.transaction()`
3. **Test Thoroughly** - Unit tests for schemas, integration tests for services
4. **Follow Naming** - Use consistent naming across schema, types, and routes
5. **Document** - Add JSDoc comments to interfaces and functions

## Next Steps

- [Testing](/development/testing) - Test your new item type
- [Runtime Configuration](/admin-guide/runtime-configuration) - Configure without code changes
