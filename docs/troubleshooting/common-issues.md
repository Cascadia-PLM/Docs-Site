---
sidebar_position: 1
title: Common Issues
---

# Common Issues and Fixes

Solutions to frequently encountered problems during development and deployment.

## Build Failures

### Postgres Package Bundled into Client Build

**Error:**
```
error during build:
node_modules/postgres/src/connection.js (5:9): "performance" is not exported by "__vite-browser-external"
```

**Symptoms:**
- Build fails during `vite build`
- Warnings about Node.js modules (`os`, `fs`, `net`, `tls`, `crypto`) being externalized

**Root Cause:**
Server-only code (database queries) is being pulled into the client bundle through import chains.

**Solutions:**

1. **Move shared types to separate files** without database imports:
   ```typescript
   // BAD: imports from file with drizzle-orm
   import type { Config } from '../db/schema/config'

   // GOOD: separate types file
   import type { Config } from './types/config'
   ```

2. **Use dynamic imports** for server-only services:
   ```typescript
   // BAD: Static import
   import { ConfigService } from '../config'

   // GOOD: Dynamic import
   let ConfigService: typeof import('../config').ConfigService | null = null
   async function getConfigService() {
     if (!ConfigService) {
       const module = await import('../config')
       ConfigService = module.ConfigService
     }
     return ConfigService
   }
   ```

3. **Configure Vite externals** (`vite.config.ts`):
   ```typescript
   export default defineConfig({
     optimizeDeps: {
       exclude: ['postgres', 'drizzle-orm'],
     },
     ssr: {
       external: ['postgres'],
     },
   })
   ```

**Prevention:**
- Keep database imports strictly in `routes/api/`, services, and server-only files
- Use `import type` for type-only imports
- Consider file naming like `*.server.ts` for server-only code

---

## Runtime Errors

### TypeError: Cannot read properties of undefined

**Context:** Loading data in components

**Error:**
```
TypeError: Cannot read properties of undefined (reading 'length')
```

**Root Cause:**
API response structure mismatch. Component accessing wrong property path.

**Fix:**
```typescript
// BAD
const data = await response.json()
setSearchResults(data.items)

// GOOD
const data = await response.json()
setSearchResults(data.data?.items ?? [])
```

**Prevention:**
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Check API response structure
- Consider typed API client functions

---

## Database Issues

### Connection Refused

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**

1. **Verify PostgreSQL is running:**
   ```bash
   # Check status
   pg_isready -h localhost -p 5432

   # Start PostgreSQL (varies by OS)
   # macOS:
   brew services start postgresql

   # Linux:
   sudo systemctl start postgresql

   # Windows:
   net start postgresql-x64-18
   ```

2. **Check DATABASE_URL:**
   ```bash
   echo $DATABASE_URL
   # Should be: postgresql://user:pass@localhost:5432/cascadia
   ```

3. **Verify database exists:**
   ```bash
   psql -U postgres -c "\l"
   ```

### Migration Errors

**Error:**
```
relation "items" does not exist
```

**Solution:**
```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:generate
npm run db:migrate
```

---

## Authentication Issues

### Session Not Persisting

**Symptoms:**
- User logged out on page refresh
- API returns 401 after login

**Solutions:**

1. **Check SESSION_SECRET:**
   ```bash
   # Must be at least 32 characters
   SESSION_SECRET=your-random-32-character-secret-here
   ```

2. **Verify cookie settings:**
   - In development: `secure: false`
   - In production: `secure: true` with HTTPS

3. **Check BASE_URL:**
   ```bash
   BASE_URL=http://localhost:3000  # Development
   BASE_URL=https://your-domain.com  # Production
   ```

### OAuth Redirect Error

**Error:**
```
redirect_uri_mismatch
```

**Solution:**
Ensure the redirect URI in your OAuth app matches:
```
http://localhost:3000/api/auth/oauth/{provider}/callback  # Development
https://your-domain.com/api/auth/oauth/{provider}/callback  # Production
```

---

## File Upload Issues

### Upload Fails with Large Files

**Error:**
```
PayloadTooLargeError: request entity too large
```

**Solutions:**

1. **Check MAX_FILE_SIZE setting:**
   ```bash
   MAX_FILE_SIZE=500MB
   ```

2. **Configure Nginx (if using):**
   ```nginx
   client_max_body_size 500M;
   ```

3. **Configure load balancer limits** (cloud providers)

### Files Not Saving

**Solutions:**

1. **Check VAULT_ROOT exists and is writable:**
   ```bash
   ls -la $VAULT_ROOT
   ```

2. **Verify storage type configuration:**
   ```bash
   VAULT_TYPE=local
   VAULT_ROOT=/app/vault
   ```

---

## Docker Issues

### Container Won't Start

**Check logs:**
```bash
docker-compose logs cascadia-app
```

**Common causes:**

1. **Database not ready:**
   Add healthcheck and depends_on in docker-compose.yml

2. **Missing environment variables:**
   ```bash
   docker-compose config  # Verify configuration
   ```

3. **Port conflict:**
   ```bash
   lsof -i :3000  # Check what's using the port
   ```

### Out of Disk Space

**Clean up Docker:**
```bash
docker system prune -a
docker volume prune
```

---

## Performance Issues

### Slow Database Queries

**Diagnose:**
```bash
# Enable query logging
LOG_LEVEL=debug npm run dev
```

**Solutions:**

1. **Add database indexes** for frequently queried columns
2. **Use pagination** for large result sets
3. **Check for N+1 queries** in relationships

### High Memory Usage

**Solutions:**

1. **Reduce Node.js heap size:**
   ```bash
   NODE_OPTIONS="--max-old-space-size=512"
   ```

2. **Enable streaming for large files**

3. **Implement pagination for large lists**

---

## Development Environment

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

```bash
# Find process
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

### Node Modules Issues

**Symptoms:**
- Module not found errors
- Version conflicts

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Getting More Help

1. Check the [FAQ](/troubleshooting/faq)
2. Search [GitHub Issues](https://github.com/your-org/cascadia/issues)
3. Open a new issue with:
   - Steps to reproduce
   - Error messages
   - Environment details (OS, Node version, etc.)
