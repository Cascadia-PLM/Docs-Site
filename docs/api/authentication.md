---
sidebar_position: 2
title: Authentication
---

# Authentication

Cascadia uses session-based authentication with support for API tokens.

## Session Authentication

For browser-based applications, use session cookies:

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response:
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

The session cookie is automatically set and included in subsequent requests.

### Logout

```bash
POST /api/auth/logout
```

### Check Session

```bash
GET /api/auth/me
```

Response:
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "roles": ["User"]
    }
  }
}
```

## API Token Authentication

For programmatic access, use API tokens:

### Generate Token

:::info Coming Soon
API token management UI is planned for a future release.
:::

### Use Token

Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer <your-api-token>" \
  https://your-instance.com/api/parts
```

## OAuth Authentication

Cascadia supports OAuth providers when enabled:

### Available Providers

- GitHub
- Google
- Microsoft/Azure AD

### OAuth Flow

1. **Initiate**: Redirect to `/api/auth/oauth/{provider}`
2. **Callback**: Provider redirects to `/api/auth/oauth/{provider}/callback`
3. **Session**: User session is created automatically

### Configuration

Set environment variables for each provider:

```bash
# GitHub
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret

# Google
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Microsoft
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=your-tenant-id
```

Enable OAuth:
```bash
ENABLE_OAUTH=true
```

## Permissions

### Role-Based Access Control

Users are assigned roles that determine their permissions:

| Role | Description |
|------|-------------|
| `User` | Basic read/write access |
| `Administrator` | Full system access |

### Permission Checking

API endpoints check permissions before executing:

```typescript
// Read permission required
GET /api/parts

// Create permission required
POST /api/parts

// Admin only
DELETE /api/users/:id
```

### Program-Based Access Control (PBAC)

Access to items is scoped by program membership:

- Users can only access items in programs they belong to
- Administrators can access all programs

## Error Responses

### 401 Unauthorized

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

Causes:
- Missing session cookie
- Invalid or expired API token
- Session expired

### 403 Forbidden

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

Causes:
- User lacks required role
- User not member of program
- Action not allowed for user's role

## Security Best Practices

### API Tokens

- Store tokens securely
- Use environment variables, not code
- Rotate tokens regularly
- Use minimal required permissions

### Sessions

- Session cookies are HTTP-only
- Sessions expire after inactivity
- Automatic extension on activity

### Network Security

- Always use HTTPS in production
- Configure CORS appropriately
- Use secure session secrets

## Example: Authenticated Request

```javascript
// Browser (session-based)
const response = await fetch('/api/parts', {
  credentials: 'include'
})

// Programmatic (token-based)
const response = await fetch('https://your-instance.com/api/parts', {
  headers: {
    'Authorization': `Bearer ${apiToken}`
  }
})
```

## Next Steps

- [Items API](/api/items) - Working with items
- [Permissions](/admin-guide/permissions) - Configure roles
