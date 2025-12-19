---
sidebar_position: 1
title: API Overview
---

# API Overview

Cascadia exposes a RESTful JSON API for programmatic access to all functionality.

## Base URL

```
https://your-instance.com/api
```

## Authentication

All API requests require authentication. See [Authentication](/api/authentication) for details.

```bash
curl -H "Authorization: Bearer <token>" \
  https://your-instance.com/api/parts
```

## Response Format

All responses are JSON with a consistent structure:

### Success Response

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid item number format",
    "details": [
      { "field": "itemNumber", "message": "Must start with a letter" }
    ]
  }
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

## Pagination

List endpoints support pagination:

```
GET /api/parts?page=1&limit=20
```

Response includes meta information:

```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

## Filtering

Filter results using query parameters:

```
GET /api/parts?state=Released&makeBuy=make
```

## Sorting

Sort results using the `sort` parameter:

```
GET /api/parts?sort=itemNumber:asc
GET /api/parts?sort=updatedAt:desc
```

## Available Endpoints

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List all items |
| GET | `/api/items/:id` | Get item by ID |
| POST | `/api/items` | Create item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

### Parts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parts` | List parts |
| GET | `/api/parts/:id` | Get part |
| POST | `/api/parts` | Create part |
| PUT | `/api/parts/:id` | Update part |
| DELETE | `/api/parts/:id` | Delete part |
| GET | `/api/parts/:id/bom` | Get BOM |
| POST | `/api/parts/:id/bom` | Add BOM item |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | List documents |
| GET | `/api/documents/:id` | Get document |
| POST | `/api/documents` | Create document |
| PUT | `/api/documents/:id` | Update document |
| POST | `/api/documents/:id/files` | Upload file |
| GET | `/api/documents/:id/files/:fileId` | Download file |

### Change Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/change-orders` | List change orders |
| GET | `/api/change-orders/:id` | Get change order |
| POST | `/api/change-orders` | Create change order |
| PUT | `/api/change-orders/:id` | Update change order |
| POST | `/api/change-orders/:id/submit` | Submit for approval |
| POST | `/api/change-orders/:id/approve` | Approve |
| POST | `/api/change-orders/:id/release` | Release |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| GET | `/api/users/me` | Get current user |

### Programs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | List programs |
| GET | `/api/programs/:id` | Get program |
| POST | `/api/programs` | Create program |
| PUT | `/api/programs/:id` | Update program |

### Designs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/designs` | List designs |
| GET | `/api/designs/:id` | Get design |
| POST | `/api/designs` | Create design |
| PUT | `/api/designs/:id` | Update design |
| GET | `/api/designs/:id/branches` | List branches |
| GET | `/api/designs/:id/commits` | List commits |

## Rate Limiting

API requests are rate limited:

- **Default**: 100 requests per minute
- **Authenticated**: 1000 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## Webhooks

:::info Coming Soon
Webhook support for real-time event notifications is planned.
:::

## Next Steps

- [Authentication](/api/authentication) - How to authenticate
- [Items API](/api/items) - Working with items
