---
sidebar_position: 2
title: Installation
---

# Installation Guide

This guide will help you set up the Cascadia PLM system for development.

## Prerequisites

- Node.js 20+
- PostgreSQL 18+
- npm or pnpm (recommended)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/cascadia-plm/CascadiaPLM.git
cd CascadiaPLM/CascadiaApp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

First, ensure PostgreSQL is running. Then create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cascadia;

# Exit psql
\q
```

:::tip Windows Users
Use the `create-db.bat` script in the repository root for quick database creation.
:::

### 4. Configure Environment Variables

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` and configure at minimum:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cascadia
SESSION_SECRET=generate-a-random-32-character-string-here
```

To generate a secure session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Initialize the Database

```bash
# Push schema to database
npm run db:push

# Seed initial data (admin user, roles, etc.)
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Default Credentials

After running the seed script, you can log in with:

- **Email**: `admin@example.com`
- **Password**: `admin123`

:::warning
Change the default password immediately in a production environment!
:::

## Project Structure

```
CascadiaApp/
├── src/
│   ├── lib/
│   │   ├── db/              # Database configuration and schema
│   │   │   ├── schema/      # Drizzle schema definitions
│   │   │   │   ├── users.ts
│   │   │   │   ├── items.ts
│   │   │   │   └── workflows.ts
│   │   │   └── index.ts
│   │   ├── auth/            # Authentication utilities
│   │   │   ├── session.ts   # Session management
│   │   │   └── password.ts  # Password hashing
│   │   └── items/           # Item management
│   │       ├── registry.ts  # Item Type Registry
│   │       ├── types/       # Item type definitions
│   │       └── services/    # Business logic services
│   ├── components/          # React components
│   ├── routes/              # TanStack Start routes
│   └── styles.css           # Global styles
├── drizzle.config.ts        # Drizzle ORM configuration
└── package.json
```

## Database Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Push schema changes to database (dev)
npm run db:push

# Open Drizzle Studio GUI
npm run db:studio

# Seed minimal data
npm run db:seed

# Seed comprehensive test data
npm run db:seed:test
```

## Troubleshooting

### Database Connection Issues

If you get connection errors:

1. Ensure PostgreSQL is running
2. Verify `DATABASE_URL` in `.env`
3. Check PostgreSQL logs for authentication errors

### Migration Issues

If migrations fail:

1. Check database schema version: `npm run db:studio`
2. Reset database if in development: Drop and recreate
3. Review migration files in `drizzle/` directory

## Next Steps

- [Quick Start Tutorial](/getting-started/quick-start) - Create your first items
- [Docker Deployment](/deployment/docker-compose) - Run with Docker
- [Architecture Overview](/getting-started/architecture) - Understand the system design
