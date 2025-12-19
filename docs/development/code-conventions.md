---
sidebar_position: 3
title: Code Conventions
---

# Code Conventions

Coding standards and best practices for Cascadia PLM development.

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PartForm.tsx` |
| Utilities | kebab-case | `item-service.ts` |
| Routes | TanStack conventions | `parts/$id.tsx` |
| Tests | Co-located | `ItemService.test.ts` |

## TypeScript

### General Rules

- Strict mode enabled
- Avoid `any` types
- Use Zod schemas for validation and type inference
- Prefer interfaces for object types, type for unions

### Path Aliases

```typescript
// Use path alias
import { Button } from '@/components/ui/button'

// Avoid relative paths
import { Button } from '../../../components/ui/button' // Don't do this
```

### Type Definitions

```typescript
// Prefer interfaces for objects
interface User {
  id: string
  email: string
  name: string
}

// Use type for unions and computed types
type ItemType = 'Part' | 'Document' | 'ChangeOrder'
type UserWithRole = User & { role: Role }
```

## Database Queries

### Drizzle ORM

Always use Drizzle ORM, never raw SQL:

```typescript
// Good
const parts = await db.select()
  .from(partsTable)
  .where(eq(partsTable.state, 'Released'))

// Bad - raw SQL
const parts = await db.execute('SELECT * FROM parts WHERE state = $1', ['Released'])
```

### Parameterized Queries

Drizzle handles parameterization automatically:

```typescript
// Safe - Drizzle parameterizes
const result = await db.select()
  .from(items)
  .where(eq(items.itemNumber, userInput))
```

### Transactions

Use transactions for multi-step operations:

```typescript
await db.transaction(async (tx) => {
  const item = await tx.insert(items).values(itemData).returning()
  await tx.insert(parts).values({ ...partData, itemId: item[0].id })
})
```

### Returning Clause

Prefer `.returning()` for insert/update operations:

```typescript
const [newItem] = await db.insert(items)
  .values(data)
  .returning()
```

## API Routes

### Route Pattern

```typescript
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { json } from '@tanstack/react-start'
import { requireAuth, requirePermission } from '@/lib/auth/server'

export const APIRoute = createAPIFileRoute('/api/parts')({
  GET: async ({ request }) => {
    const { user } = await requireAuth(request)
    const parts = await PartService.list()
    return json({ data: parts })
  },

  POST: async ({ request }) => {
    const { user } = await requireAuth(request)
    await requirePermission(request, 'Part', 'create')
    const body = await request.json()
    const part = await PartService.create(body, user.id)
    return json({ data: part }, { status: 201 })
  }
})
```

### Error Handling

Service layer throws errors, caught in API routes:

```typescript
export const APIRoute = createAPIFileRoute('/api/parts/$id')({
  GET: async ({ request, params }) => {
    try {
      const part = await PartService.get(params.id)
      if (!part) {
        return json({ error: 'Part not found' }, { status: 404 })
      }
      return json({ data: part })
    } catch (error) {
      console.error('Error fetching part:', error)
      return json({ error: 'Internal server error' }, { status: 500 })
    }
  }
})
```

## UI Components

### Base Components

Use components from `src/components/ui/`:

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
```

### Class Merging

Use `cn()` utility for conditional classes:

```typescript
import { cn } from '@/lib/utils'

function MyComponent({ className, variant }) {
  return (
    <div className={cn(
      'base-styles',
      variant === 'primary' && 'primary-styles',
      className
    )}>
      {/* content */}
    </div>
  )
}
```

### Forms

Use TanStack Form with Zod validation:

```typescript
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'

const form = useForm({
  defaultValues: { name: '' },
  validatorAdapter: zodValidator(),
  validators: {
    onChange: partSchema,
  },
  onSubmit: async ({ value }) => {
    await createPart(value)
  },
})
```

## Testing

### Test Location

Co-locate tests with source files:

```
src/lib/items/services/
├── ItemService.ts
└── ItemService.test.ts
```

### Test Structure

```typescript
describe('ItemService', () => {
  describe('create', () => {
    it('creates an item with valid data', async () => {
      // Arrange
      const data = { itemNumber: 'PN-001' }

      // Act
      const result = await ItemService.create(data)

      // Assert
      expect(result.itemNumber).toBe('PN-001')
    })
  })
})
```

## Git Conventions

### Branch Naming

```
feature/add-part-bom
bugfix/fix-login-redirect
refactor/improve-item-service
```

### Commit Messages

```
feat: add BOM relationship editing
fix: resolve login redirect loop
refactor: extract item validation logic
docs: update API documentation
test: add ItemService unit tests
```

## Security

### Authentication

Always check auth in API routes:

```typescript
const { user } = await requireAuth(request)
```

### Permission Checks

```typescript
await requirePermission(request, 'Part', 'delete')
```

### Input Validation

Validate all user input with Zod:

```typescript
const validatedData = partSchema.parse(requestBody)
```

## Next Steps

- [Testing](/development/testing) - Test infrastructure
- [Adding Item Types](/development/adding-item-types) - Extend the system
