---
sidebar_position: 6
title: Configuration Reference
---

# Configuration Reference

Complete reference for all environment variables used across Cascadia services.

## Configuration Hierarchy

1. **Environment Variables** - Highest priority, set at runtime
2. **`.env` Files** - Loaded on startup (development)
3. **Docker Compose** - Environment section in compose files
4. **Kubernetes** - ConfigMaps and Secrets
5. **Defaults** - Hardcoded fallbacks

## Core App Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Secret for session encryption (32+ chars) | `your-random-32-character-string` |

### Application Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode (`development`, `production`, `test`) |
| `PORT` | `3000` | HTTP port to listen on |
| `BASE_URL` | `http://localhost:3000` | Public URL of the application |
| `LOG_LEVEL` | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`) |

### Vault Mode

| Variable | Default | Description |
|----------|---------|-------------|
| `VAULT_MODE` | `embedded` | How vault operates: `embedded` or `service` |
| `VAULT_SERVICE_URL` | - | URL when `VAULT_MODE=service` |
| `VAULT_SERVICE_TOKEN` | - | Auth token for vault service |

When `VAULT_MODE=embedded`:

| Variable | Default | Description |
|----------|---------|-------------|
| `VAULT_ROOT` | `/app/vault` | Local storage directory |
| `VAULT_TYPE` | `local` | Storage backend: `local` or `s3` |
| `FILE_STORAGE_PATH` | `/app/storage/files` | General file storage |

### Jobs Mode

| Variable | Default | Description |
|----------|---------|-------------|
| `JOBS_MODE` | `embedded` | How jobs run: `embedded`, `service`, or `disabled` |
| `RABBITMQ_URL` | - | AMQP URL when using job service |

### OAuth Providers (Optional)

| Variable | Description |
|----------|-------------|
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `MICROSOFT_CLIENT_ID` | Microsoft/Azure AD client ID |
| `MICROSOFT_CLIENT_SECRET` | Microsoft/Azure AD secret |
| `MICROSOFT_TENANT_ID` | Azure AD tenant ID |

### Feature Flags

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_REGISTRATION` | `true` | Allow new user registration |
| `REQUIRE_EMAIL_VERIFICATION` | `false` | Require email verification |
| `ENABLE_OAUTH` | `false` | Enable OAuth login buttons |

## Vault Service Configuration

When running vault as a standalone service.

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SERVICE_TOKEN` | Shared secret for Core App authentication |

### Storage Configuration

#### Local Storage

```bash
STORAGE_TYPE=local
STORAGE_PATH=/app/vault
```

#### S3/MinIO Storage

```bash
STORAGE_TYPE=s3
S3_BUCKET=cascadia-vault
S3_REGION=us-east-1
S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
S3_ENDPOINT=                        # Leave empty for AWS, set for MinIO
S3_FORCE_PATH_STYLE=false           # Set true for MinIO
```

#### Azure Blob Storage

```bash
STORAGE_TYPE=azure
AZURE_STORAGE_ACCOUNT=cascadiavault
AZURE_STORAGE_KEY=your-storage-key
AZURE_CONTAINER=vault
```

### Service Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | HTTP port for internal API |
| `MAX_FILE_SIZE` | `500MB` | Maximum upload size |
| `ALLOWED_EXTENSIONS` | `*` | Comma-separated whitelist (or `*` for all) |

## Jobs Server Configuration

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `RABBITMQ_URL` | AMQP connection string |

### Worker Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKER_CONCURRENCY` | `5` | Max concurrent jobs per worker |
| `JOB_TYPES` | `*` | Job types to process (comma-separated or `*`) |
| `JOB_TIMEOUT` | `300000` | Default job timeout (ms) |
| `MAX_RETRIES` | `3` | Default retry attempts |

### Specialized Workers

```bash
# General worker
JOB_TYPES=reports,notifications,cleanup,integration

# CAD conversion worker (dedicated hardware)
JOB_TYPES=conversion.cad
WORKER_CONCURRENCY=2

# Office conversion worker
JOB_TYPES=conversion.office
WORKER_CONCURRENCY=10
```

## PostgreSQL Configuration

When running PostgreSQL in Docker.

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `cascadia` | Database name |
| `POSTGRES_USER` | `postgres` | Database user |
| `POSTGRES_PASSWORD` | - | Database password (required) |
| `PGDATA` | `/var/lib/postgresql/data/pgdata` | Data directory |

## RabbitMQ Configuration

When running RabbitMQ in Docker.

| Variable | Default | Description |
|----------|---------|-------------|
| `RABBITMQ_DEFAULT_USER` | `guest` | Management user |
| `RABBITMQ_DEFAULT_PASS` | `guest` | Management password |
| `RABBITMQ_DEFAULT_VHOST` | `/` | Default virtual host |

Connection string format:
```
amqp://user:password@host:5672/vhost
```

## MinIO Configuration

When running MinIO for S3-compatible storage.

| Variable | Default | Description |
|----------|---------|-------------|
| `MINIO_ROOT_USER` | - | Admin username |
| `MINIO_ROOT_PASSWORD` | - | Admin password (8+ chars) |
| `MINIO_BROWSER` | `on` | Enable web console |

## Environment File Examples

### Development (`.env`)

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cascadia

# Security
SESSION_SECRET=dev-session-secret-change-in-prod

# Application
NODE_ENV=development
BASE_URL=http://localhost:3000
LOG_LEVEL=debug

# Vault (embedded, local storage)
VAULT_MODE=embedded
VAULT_TYPE=local
VAULT_ROOT=./vault-storage

# Jobs (embedded, no queue)
JOBS_MODE=embedded
```

### Docker Compose (`.env.docker`)

```bash
# Database
POSTGRES_DB=cascadia
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-this-password
POSTGRES_PORT=5432

# Application
APP_PORT=3000
NODE_ENV=production
BASE_URL=http://localhost:3000
SESSION_SECRET=generate-a-random-32-character-string

# Vault (embedded)
VAULT_MODE=embedded
VAULT_TYPE=local
FILE_STORAGE_PATH=/app/storage/files
VAULT_ROOT=/app/vault

# Jobs (disabled by default)
JOBS_MODE=disabled

# Tools (optional)
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050
```

### Production (Example)

```bash
# Database (managed)
DATABASE_URL=postgresql://cascadia:${DB_PASSWORD}@db.example.com:5432/cascadia?sslmode=require

# Security
SESSION_SECRET=${SESSION_SECRET}  # From secrets manager

# Application
NODE_ENV=production
BASE_URL=https://plm.example.com
LOG_LEVEL=info

# Vault (S3)
VAULT_MODE=embedded
VAULT_TYPE=s3
S3_BUCKET=cascadia-vault-prod
S3_REGION=us-east-1
S3_ACCESS_KEY=${AWS_ACCESS_KEY}
S3_SECRET_KEY=${AWS_SECRET_KEY}

# Jobs (separate service)
JOBS_MODE=service
RABBITMQ_URL=amqp://cascadia:${MQ_PASSWORD}@mq.example.com:5672

# OAuth
ENABLE_OAUTH=true
GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
```

### Kubernetes ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cascadia-config
data:
  NODE_ENV: "production"
  BASE_URL: "https://plm.example.com"
  LOG_LEVEL: "info"
  VAULT_MODE: "service"
  VAULT_SERVICE_URL: "http://vault-service:3001"
  JOBS_MODE: "service"
```

### Kubernetes Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cascadia-secrets
type: Opaque
stringData:
  DATABASE_URL: "postgresql://..."
  SESSION_SECRET: "..."
  VAULT_SERVICE_TOKEN: "..."
  RABBITMQ_URL: "amqp://..."
```

## Secrets Management

### Development

Use `.env` files (never commit to git):
```bash
# Add to .gitignore
.env
.env.local
.env.*.local
```

### Docker Compose

Use Docker secrets for sensitive values:
```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt
  session_secret:
    file: ./secrets/session_secret.txt

services:
  app:
    secrets:
      - db_password
      - session_secret
```

### Kubernetes

Use Kubernetes Secrets:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cascadia-secrets
type: Opaque
data:
  database-url: cG9zdGdyZXNxbDovLy4uLg==  # base64 encoded
```

### Cloud Providers

- **AWS**: Secrets Manager or Parameter Store
- **GCP**: Secret Manager
- **Azure**: Key Vault
