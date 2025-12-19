---
sidebar_position: 4
title: Testing
---

# Testing Guide

Cascadia uses a layered testing approach with Vitest for unit/integration tests and Playwright for E2E tests.

## Quick Start

```bash
# Run all unit/integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Open Vitest UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Test Architecture

| Layer | Tool | Purpose | Location |
|-------|------|---------|----------|
| **Unit** | Vitest | Services, utilities | `src/**/*.test.ts` |
| **Component** | Vitest + RTL | React components | `src/**/*.test.tsx` |
| **Integration** | Vitest | API routes with DB | `src/**/*.test.ts` |
| **E2E** | Playwright | Full workflows | `tests/e2e/**/*.spec.ts` |

## Directory Structure

```
src/
├── __tests__/
│   ├── setup.ts              # Test setup
│   ├── fixtures/             # Test data factories
│   │   ├── users.ts
│   │   ├── items.ts
│   │   └── builder.ts
│   └── helpers/              # Test utilities
│       ├── db.ts
│       ├── auth.ts
│       └── render.tsx
tests/
└── e2e/
    ├── fixtures/
    ├── auth.spec.ts
    └── release-workflow.spec.ts
```

## Unit Tests

Test individual functions and classes in isolation:

```typescript
import { describe, it, expect } from 'vitest'
import { ItemService } from './ItemService'

describe('ItemService', () => {
  describe('create', () => {
    it('creates an item with valid data', async () => {
      const data = { itemNumber: 'PN-001', revision: 'A' }
      const result = await ItemService.create('Part', data, userId, orgId)

      expect(result.id).toBeDefined()
      expect(result.itemNumber).toBe('PN-001')
    })
  })
})
```

### Mocking Dependencies

```typescript
import { vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: '123' }])
      })
    })
  }
}))
```

## Integration Tests

Test services against a real database with transaction rollback:

```typescript
import { TestDatabase } from '@/__tests__/helpers/db'
import { insertTestUser } from '@/__tests__/fixtures/users'

describe('MyService', () => {
  const testDb = new TestDatabase()
  let user

  beforeAll(async () => {
    await testDb.setup()
  })

  afterAll(async () => {
    await testDb.teardown()
  })

  beforeEach(async () => {
    await testDb.beginTransaction()
    user = await insertTestUser(testDb.db)
  })

  afterEach(async () => {
    await testDb.rollback()
  })

  it('does something with the database', async () => {
    // Your test - changes rolled back after
  })
})
```

### Using Test Fixtures

```typescript
import {
  insertTestPart,
  insertTestDocument,
  createBOMRelationship,
} from '@/__tests__/fixtures/items'

const { item, part } = await insertTestPart(db, userId, {
  name: 'My Part',
  makeBuy: 'make',
})

await createBOMRelationship(db, parentId, childId, userId, {
  quantity: 5,
  findNumber: 10,
})
```

### TestDataBuilder

```typescript
import { TestDataBuilder } from '@/__tests__/fixtures/builder'

const scenario = await new TestDataBuilder(db)
  .withUser({ email: 'admin@acme.com' }, 'Administrator')
  .withPart({ name: 'Assembly' }, 'assembly')
  .withPart({ name: 'Component' }, 'component')
  .withBOM('assembly', 'component', { quantity: 2 })
  .build()

const userId = scenario.users['admin@acme.com'].id
const assemblyId = scenario.parts['assembly'].item.id
```

## Component Tests

Test React components with React Testing Library:

```typescript
import { renderWithProviders, screen } from '@/__tests__/helpers/render'

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const { user } = renderWithProviders(<MyComponent />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

## E2E Tests

Test complete user workflows with Playwright:

```typescript
import { test, expect } from './fixtures'

test.describe('My Feature', () => {
  test('user can create a part', async ({ authenticatedPage: page }) => {
    await page.goto('/parts')

    await page.click('button:has-text("New Part")')
    await page.fill('input[name="itemNumber"]', 'PN-001')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL(/\/parts\//)
  })
})
```

### Running E2E Tests

```bash
# Install browsers
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run specific test
npx playwright test tests/e2e/auth.spec.ts

# Run in headed mode
npx playwright test --headed
```

## Test Utilities Reference

### Database Utilities

| Utility | Description |
|---------|-------------|
| `TestDatabase` | Database wrapper with transaction support |
| `setupTestDb()` | Quick setup helper |

### Auth Utilities

| Utility | Description |
|---------|-------------|
| `createMockRequest()` | Create mock HTTP request |
| `mockAuth()` | Create auth context |
| `setupAuthMocks()` | Configure auth module mocks |

### Fixture Factories

| Factory | Description |
|---------|-------------|
| `insertTestUser()` | User fixtures |
| `insertTestPart()` | Part fixtures |
| `insertTestDocument()` | Document fixtures |
| `insertTestChangeOrder()` | Change order fixtures |
| `createBOMRelationship()` | BOM relationship helper |
| `TestDataBuilder` | Fluent builder |

### Vault Utilities

| Utility | Description |
|---------|-------------|
| `MockVaultStorage` | In-memory vault |
| `createTestFile()` | Generate test files |

## Best Practices

### Test Organization

1. **Co-locate tests** - Put `*.test.ts` next to source
2. **Descriptive names** - `describe('ItemService.create')` not `describe('create')`
3. **Test behavior** - Focus on what, not how
4. **Independent tests** - Each test should work in isolation

### Test Data

1. **Use factories** - Don't hardcode test data
2. **Generate unique values** - Use timestamps or UUIDs
3. **Clean up** - Use transaction rollback
4. **Use presets** - `partPresets.released()`

### Performance

1. **Run in parallel** - Default in Vitest and Playwright
2. **Use transactions** - Faster than full resets
3. **Mock external services** - Don't call real APIs
4. **Use `beforeAll`** - For one-time setup

## Troubleshooting

### Database Connection Error

```bash
# Ensure PostgreSQL is running
pg_isready -h localhost -p 5432

# Run db:push to create tables
npm run db:push
```

### E2E Tests Fail to Start

- Check if port 3000 is available
- Increase `webServer.timeout` in playwright.config.ts

### Slow Tests

- Use transaction rollback
- Mock external services
- Run specific files: `npm test -- src/lib/items`

## Next Steps

- [Adding Item Types](/development/adding-item-types) - Test new item types
- [Contributing](/development/contributing) - CI/CD integration
