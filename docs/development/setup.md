---
sidebar_position: 1
title: Development Setup
---

# Development Setup

Set up your local development environment for Cascadia PLM.

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **PostgreSQL** 18+
- **Git**
- **npm** or **pnpm**

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/cascadia.git
cd cascadia/CascadiaApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database connection:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cascadia
SESSION_SECRET=dev-session-secret-change-in-prod
NODE_ENV=development
```

### 4. Create Database

**Windows:**
```bash
# From repository root
create-db.bat
```

**macOS/Linux:**
```bash
createdb cascadia
```

### 5. Initialize Schema

```bash
npm run db:push
```

### 6. Seed Data (Optional)

```bash
# Minimal seed - org, admin user, roles, program
npm run db:seed

# Comprehensive test data - multiple users, designs, items
npm run db:seed:test
```

### 7. Start Development Server

```bash
npm run dev
```

Access the application at `http://localhost:3000`

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |

### Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migrations from schema changes |
| `npm run db:push` | Push schema directly (dev only) |
| `npm run db:studio` | Open Drizzle Studio GUI |
| `npm run db:seed` | Minimal seed data |
| `npm run db:seed:test` | Comprehensive test data |

### Testing Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run Vitest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:ui` | Open Vitest UI |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run check` | Format + lint fix |

## IDE Setup

### VS Code (Recommended)

Install recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

Workspace settings are included in `.vscode/settings.json`.

### WebStorm / IntelliJ

- Enable ESLint integration
- Enable Prettier on save
- Configure TypeScript to use workspace version

## Project Structure

```
CascadiaApp/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Base UI components
│   │   ├── parts/      # Part-specific components
│   │   ├── documents/  # Document components
│   │   └── ...
│   ├── lib/
│   │   ├── auth/       # Authentication
│   │   ├── db/         # Database schema & queries
│   │   ├── items/      # Item type system
│   │   ├── services/   # Business logic
│   │   └── vault/      # File storage
│   ├── routes/
│   │   ├── api/        # API routes
│   │   └── ...         # UI routes
│   └── __tests__/      # Test utilities
├── tests/
│   └── e2e/            # Playwright tests
├── drizzle/            # Generated migrations
└── public/             # Static assets
```

## Troubleshooting

### Database Connection Issues

```bash
# Verify PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
psql -U postgres -d cascadia -c "SELECT 1"
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use a different port
PORT=3001 npm run dev
```

### Node Module Issues

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- [Architecture](/development/architecture) - System design overview
- [Code Conventions](/development/code-conventions) - Coding standards
- [Adding Item Types](/development/adding-item-types) - Extend the system
