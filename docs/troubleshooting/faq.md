---
sidebar_position: 2
title: FAQ
---

# Frequently Asked Questions

## General

### What is Cascadia PLM?

Cascadia is an open-source, code-first Product Lifecycle Management (PLM) system. Unlike traditional low-code PLM systems, Cascadia is designed for developers who want full control over customization through TypeScript code.

### What license is Cascadia released under?

Cascadia is released under the AGPL-3.0 license, which allows free use, modification, and distribution while requiring that derivative works also be open source.

### What databases does Cascadia support?

Cascadia is designed specifically for PostgreSQL 18+. This allows us to leverage PostgreSQL's advanced features like JSONB, full-text search, and robust transaction support.

---

## Installation & Setup

### What are the system requirements?

**Minimum:**
- Node.js 20+
- PostgreSQL 18+
- 4GB RAM
- 20GB storage

**Recommended for production:**
- 8GB+ RAM
- 100GB+ storage
- SSD storage

### Can I use MySQL or SQLite instead of PostgreSQL?

No, Cascadia is built specifically for PostgreSQL. We use PostgreSQL-specific features throughout the codebase and don't plan to support other databases.

### Does Cascadia work on Windows?

Yes! Cascadia runs on Windows, macOS, and Linux. Use the provided `create-db.bat` script on Windows for database setup.

---

## Features

### What item types does Cascadia support?

Built-in item types include:
- **Parts** - Manufacturing parts with BOM relationships
- **Documents** - File attachments and documentation
- **Change Orders** - ECO/ECN change management
- **Requirements** - Requirements tracking
- **Tasks** - Work items with Kanban support

You can also create custom item types using the registry pattern.

### Does Cascadia support file versioning?

Yes, the vault system tracks versions of all files. Each file revision is stored and can be retrieved.

### Can I integrate Cascadia with ERP systems?

Yes, Cascadia exposes a REST API that can be used for integration. The jobs system (when fully implemented) will support scheduled sync tasks.

### Does Cascadia support workflows?

Yes, Cascadia includes a workflow system for managing item lifecycle states. You can define custom states and transitions for each item type.

---

## Development

### How do I add a custom item type?

See the [Adding Item Types](/development/adding-item-types) guide. The basic steps are:
1. Define TypeScript interface and Zod schema
2. Create database table
3. Build UI components
4. Register the type
5. Create API and UI routes

### Can I customize the UI?

Yes, the UI is built with React and Tailwind CSS. You can customize:
- Base components in `src/components/ui/`
- Item-specific components in `src/components/{type}/`
- Styles via Tailwind configuration

### How do I run tests?

```bash
npm run test          # Unit/integration tests
npm run test:e2e      # End-to-end tests
```

See the [Testing Guide](/development/testing) for details.

---

## Deployment

### What deployment options are available?

- **Single Server** - All components on one machine
- **Distributed** - Separate app, jobs, and infrastructure servers
- **Kubernetes** - Container orchestration with auto-scaling
- **Cloud Database** - Managed PostgreSQL (RDS, Cloud SQL, Azure)

See the [Deployment Guide](/deployment/docker-compose) for details.

### How do I set up HTTPS?

For production, use a reverse proxy (Nginx, Traefik) or load balancer to handle TLS termination. See the deployment guides for examples.

### How do I back up my data?

Use PostgreSQL's `pg_dump` for database backups:
```bash
pg_dump -U postgres -d cascadia > backup.sql
```

Also back up the vault storage directory. See [Backup & Recovery](/admin-guide/backup-recovery).

---

## Security

### How is authentication handled?

Cascadia uses session-based authentication. Sessions are stored in the database with secure cookies. OAuth providers (GitHub, Google, Microsoft) are also supported.

### What permissions are available?

Role-based access control (RBAC) with:
- User role (basic access)
- Administrator role (full access)

Program-based access control (PBAC) restricts access to items within programs a user belongs to.

### Is data encrypted?

- **In transit**: Yes, use HTTPS in production
- **At rest**: Use PostgreSQL and storage encryption (available on managed services)
- **Sessions**: Session data is encrypted with SESSION_SECRET

---

## Performance

### How many users can Cascadia support?

This depends on your deployment:
- **Single server**: < 50 concurrent users
- **Distributed**: 50-500 concurrent users
- **Kubernetes**: 500+ concurrent users with proper scaling

### How can I improve performance?

1. Use managed database with proper sizing
2. Enable connection pooling
3. Add read replicas for read-heavy workloads
4. Use S3/MinIO for file storage
5. Scale app servers horizontally

---

## Troubleshooting

### Where are the log files?

Cascadia logs to stdout. In Docker, use:
```bash
docker-compose logs -f cascadia-app
```

For detailed logs:
```bash
LOG_LEVEL=debug npm run dev
```

### How do I reset my admin password?

Use the database directly:
```sql
-- Update with a new hashed password
UPDATE users SET password_hash = '...' WHERE email = 'admin@example.com';
```

Or delete the user and re-run the seed script.

### My changes aren't showing up

1. Clear browser cache
2. Restart the dev server
3. Check for build errors
4. Verify database connection

---

## Contributing

### How can I contribute?

See the [Contributing Guide](/development/contributing). We welcome:
- Bug reports
- Feature requests
- Pull requests
- Documentation improvements

### Where do I report bugs?

Open an issue on GitHub with:
- Steps to reproduce
- Expected vs actual behavior
- Error messages
- Environment details

---

## Getting Help

### Where can I get support?

- Check this documentation
- Search [GitHub Issues](https://github.com/your-org/cascadia/issues)
- Open a new issue
- Join community discussions

### Is commercial support available?

:::info Coming Soon
Commercial support options are being developed.
:::
