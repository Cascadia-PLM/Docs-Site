---
sidebar_position: 1
title: Docker Compose
---

# Docker Compose Deployment

This guide explains how to run Cascadia PLM using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or later
- Docker Compose V2 (comes with Docker Desktop)
- At least 2GB of available RAM
- 5GB of available disk space

## Quick Start

1. **Copy the Docker environment file**:
   ```bash
   cp .env.docker .env
   ```

2. **Edit the `.env` file** and update the following critical values:
   - `SESSION_SECRET`: Generate a secure random 32-character string
   - `POSTGRES_PASSWORD`: Change from default for production
   - `PGADMIN_PASSWORD`: Change from default if using pgAdmin

3. **Start the application**:
   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   - Application: http://localhost:3000
   - pgAdmin (optional): http://localhost:5050

5. **View logs**:
   ```bash
   docker-compose logs -f app
   ```

## Architecture

The Docker setup includes three services:

### 1. PostgreSQL Database (`postgres`)
- **Image**: `postgres:18-alpine`
- **Port**: 5432 (configurable via `POSTGRES_PORT`)
- **Data**: Persisted in `postgres_data` volume
- **Health Check**: Automatic readiness probe

### 2. Cascadia Application (`app`)
- **Build**: Multi-stage Dockerfile (builder + production)
- **Port**: 3000 (configurable via `APP_PORT`)
- **Storage**: Persistent volumes for files and vault
- **Auto-migration**: Runs `drizzle-kit push` on startup

### 3. pgAdmin (Optional, `pgadmin`)
- **Profile**: `tools` (not started by default)
- **Port**: 5050 (configurable via `PGADMIN_PORT`)
- **Purpose**: Web-based PostgreSQL administration

## Configuration

### Environment Variables

All configuration is done through the `.env` file. Key variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 3000 | Application port on host |
| `POSTGRES_DB` | cascadia | Database name |
| `POSTGRES_USER` | postgres | Database user |
| `POSTGRES_PASSWORD` | postgres | Database password (change in production!) |
| `POSTGRES_PORT` | 5432 | PostgreSQL port on host |
| `SESSION_SECRET` | (required) | Secure random string for sessions |
| `NODE_ENV` | production | Node.js environment |

## Docker Compose Commands

### Start Services
```bash
# Start in detached mode
docker-compose up -d

# Start with pgAdmin tool
docker-compose --profile tools up -d

# Start and rebuild images
docker-compose up -d --build
```

### Stop Services
```bash
# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (deletes data!)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 app
```

### Execute Commands
```bash
# Access app container shell
docker-compose exec app sh

# Run database migrations
docker-compose exec app npx drizzle-kit push

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d cascadia
```

## Database Management

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres cascadia > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres -d cascadia
```

### Access Database with psql
```bash
docker-compose exec postgres psql -U postgres -d cascadia
```

### Use pgAdmin
1. Start with tools profile: `docker-compose --profile tools up -d`
2. Open http://localhost:5050
3. Login with credentials from `.env`
4. Add server:
   - **Name**: Cascadia
   - **Host**: `postgres`
   - **Port**: 5432
   - **Database**: `cascadia`
   - **Username**: `postgres`
   - **Password**: (from `POSTGRES_PASSWORD`)

## Production Deployment

### Security Checklist

Before deploying to production:

- [ ] Change `POSTGRES_PASSWORD` to a strong password
- [ ] Generate a secure `SESSION_SECRET` (32+ random characters)
- [ ] Change `PGADMIN_PASSWORD` if using pgAdmin
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `BASE_URL` for your domain
- [ ] Enable HTTPS/TLS (use reverse proxy like Nginx or Traefik)
- [ ] Set up automated backups
- [ ] Configure firewall rules (only expose necessary ports)
- [ ] Review and configure OAuth providers if needed
- [ ] Set up monitoring and alerting

### Recommended Production Setup

1. **Use Docker Secrets** for sensitive data
2. **Use a reverse proxy** (Nginx, Traefik, Caddy) for HTTPS/TLS termination
3. **Enable resource limits** in `docker-compose.yml`
4. **Configure proper logging** (JSON logs to stdout)

## Volumes

The setup creates persistent volumes:

| Volume | Purpose |
|--------|---------|
| `postgres_data` | PostgreSQL database files |
| `app_storage` | Uploaded files and attachments |
| `app_vault` | Secure document storage |
| `pgadmin_data` | pgAdmin configuration |

### Backup Volumes
```bash
# Backup app storage
docker run --rm -v cascadiaapp_app_storage:/data -v $(pwd):/backup alpine tar czf /backup/storage-backup.tar.gz -C /data .

# Restore app storage
docker run --rm -v cascadiaapp_app_storage:/data -v $(pwd):/backup alpine tar xzf /backup/storage-backup.tar.gz -C /data
```

## Troubleshooting

### Application won't start

1. Check logs: `docker-compose logs app`
2. Verify database is healthy: `docker-compose ps`
3. Check environment variables: `docker-compose config`

### Database connection errors

- Ensure `DATABASE_URL` points to `postgres` (container name), not `localhost`
- Verify `POSTGRES_PASSWORD` matches between services
- Check if PostgreSQL is healthy: `docker-compose ps postgres`

### Port conflicts

If ports 3000 or 5432 are already in use:

1. Edit `.env` file:
   ```
   APP_PORT=3001
   POSTGRES_PORT=5433
   ```

2. Restart services:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Rebuild from scratch

```bash
# Stop and remove everything
docker-compose down -v

# Remove built images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```
