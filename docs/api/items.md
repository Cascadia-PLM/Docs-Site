---
sidebar_position: 3
title: Items API
---

# Items API

The Items API provides a unified interface for working with all item types (Parts, Documents, Change Orders, etc.).

## Base Endpoint

```
/api/items
```

## Item Object

```json
{
  "id": "uuid",
  "masterId": "uuid",
  "itemNumber": "PN-001",
  "revision": "A",
  "name": "Widget Assembly",
  "description": "Main widget assembly",
  "type": "Part",
  "state": "Draft",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T14:45:00Z",
  "createdBy": "uuid",
  "designId": "uuid",
  "programId": "uuid",

  // Type-specific fields
  "makeBuy": "make",
  "unitOfMeasure": "EA",
  "leadTime": 14
}
```

## List Items

```bash
GET /api/items
GET /api/items?type=Part
GET /api/items?state=Released&limit=50
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by item type |
| `state` | string | Filter by lifecycle state |
| `designId` | uuid | Filter by design |
| `programId` | uuid | Filter by program |
| `search` | string | Search item number and name |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20, max: 100) |
| `sort` | string | Sort field and direction |

### Response

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "itemNumber": "PN-001",
        "name": "Widget",
        "type": "Part",
        "state": "Released"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

## Get Item

```bash
GET /api/items/:id
```

### Response

```json
{
  "data": {
    "id": "uuid",
    "itemNumber": "PN-001",
    "revision": "A",
    "name": "Widget Assembly",
    "type": "Part",
    "state": "Released",
    "makeBuy": "make",
    "unitOfMeasure": "EA"
  }
}
```

## Create Item

```bash
POST /api/items
Content-Type: application/json

{
  "type": "Part",
  "itemNumber": "PN-002",
  "name": "New Widget",
  "description": "A new widget component",
  "makeBuy": "buy",
  "unitOfMeasure": "EA",
  "designId": "uuid",
  "programId": "uuid"
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Item type (Part, Document, etc.) |
| `itemNumber` | string | Unique item identifier |
| `name` | string | Item name |

### Response

```json
{
  "data": {
    "id": "uuid",
    "itemNumber": "PN-002",
    "revision": "A",
    "name": "New Widget",
    "type": "Part",
    "state": "Draft"
  }
}
```

## Update Item

```bash
PUT /api/items/:id
Content-Type: application/json

{
  "name": "Updated Widget Name",
  "description": "Updated description"
}
```

### Response

```json
{
  "data": {
    "id": "uuid",
    "itemNumber": "PN-002",
    "name": "Updated Widget Name",
    "description": "Updated description"
  }
}
```

## Delete Item

```bash
DELETE /api/items/:id
```

### Response

```json
{
  "data": {
    "success": true
  }
}
```

:::warning
Delete is only allowed for items in Draft state. Released items must be obsoleted through the change order process.
:::

## Item Relationships

### Get Relationships

```bash
GET /api/items/:id/relationships
```

### Response

```json
{
  "data": {
    "relationships": [
      {
        "id": "uuid",
        "type": "BOM",
        "sourceItemId": "uuid",
        "targetItemId": "uuid",
        "targetItem": {
          "itemNumber": "PN-003",
          "name": "Component"
        },
        "quantity": 5,
        "findNumber": 10
      }
    ]
  }
}
```

### Add Relationship

```bash
POST /api/items/:id/relationships
Content-Type: application/json

{
  "type": "BOM",
  "targetItemId": "uuid",
  "quantity": 5,
  "findNumber": 10
}
```

### Update Relationship

```bash
PUT /api/items/:id/relationships/:relationshipId
Content-Type: application/json

{
  "quantity": 10
}
```

### Delete Relationship

```bash
DELETE /api/items/:id/relationships/:relationshipId
```

## Lifecycle States

### Get Available Transitions

```bash
GET /api/items/:id/transitions
```

### Response

```json
{
  "data": {
    "currentState": "Draft",
    "availableTransitions": [
      {
        "name": "Submit",
        "toState": "In Review"
      }
    ]
  }
}
```

### Execute Transition

```bash
POST /api/items/:id/transitions
Content-Type: application/json

{
  "transition": "Submit",
  "comment": "Ready for review"
}
```

## Item History

### Get History

```bash
GET /api/items/:id/history
```

### Response

```json
{
  "data": {
    "history": [
      {
        "id": "uuid",
        "action": "Created",
        "user": {
          "id": "uuid",
          "name": "John Doe"
        },
        "timestamp": "2024-01-15T10:30:00Z",
        "changes": {}
      },
      {
        "id": "uuid",
        "action": "Updated",
        "user": {
          "id": "uuid",
          "name": "Jane Smith"
        },
        "timestamp": "2024-01-15T14:45:00Z",
        "changes": {
          "name": {
            "from": "Widget",
            "to": "Widget Assembly"
          }
        }
      }
    ]
  }
}
```

## Item Graph

### Get Relationship Graph

```bash
GET /api/items/:id/graph
GET /api/items/:id/graph?depth=2&direction=both
```

### Query Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `depth` | 1 | How many levels to traverse |
| `direction` | both | `up`, `down`, or `both` |

### Response

```json
{
  "data": {
    "nodes": [
      {
        "id": "uuid",
        "itemNumber": "PN-001",
        "name": "Assembly",
        "type": "Part"
      }
    ],
    "edges": [
      {
        "source": "uuid-1",
        "target": "uuid-2",
        "type": "BOM",
        "quantity": 5
      }
    ]
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `ITEM_NOT_FOUND` | Item does not exist |
| `DUPLICATE_ITEM_NUMBER` | Item number already in use |
| `INVALID_STATE_TRANSITION` | Transition not allowed |
| `VALIDATION_ERROR` | Input validation failed |

## Next Steps

- [API Overview](/api/overview) - General API information
- [Authentication](/api/authentication) - API authentication
