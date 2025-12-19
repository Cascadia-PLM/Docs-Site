---
sidebar_position: 6
title: Backup & Recovery
---

# Backup & Recovery

## Database Backup

### Using Docker

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres cascadia > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T postgres psql -U postgres -d cascadia
```

### Direct PostgreSQL

```bash
# Backup
pg_dump -U postgres -d cascadia > backup.sql

# Restore
psql -U postgres -d cascadia < backup.sql
```

## File Storage Backup

### Docker Volumes

```bash
# Backup app storage
docker run --rm -v cascadiaapp_app_storage:/data -v $(pwd):/backup alpine tar czf /backup/storage-backup.tar.gz -C /data .

# Restore app storage
docker run --rm -v cascadiaapp_app_storage:/data -v $(pwd):/backup alpine tar xzf /backup/storage-backup.tar.gz -C /data
```

### Local Storage

For local file storage, backup the directory specified by `FILE_STORAGE_PATH` (default: `./vault-storage`).

## Automated Backups

Consider setting up:
- Scheduled database dumps (cron)
- Volume snapshots (cloud providers)
- Point-in-time recovery (managed PostgreSQL)
