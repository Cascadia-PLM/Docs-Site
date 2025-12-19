---
sidebar_position: 1
title: Parts Management
---

# Parts Management

Parts are the core item type in Cascadia PLM, representing manufacturing components and assemblies.

## Overview

Parts in Cascadia support:
- Revision control with automatic numbering
- Bill of Materials (BOM) relationships
- Where-used analysis
- Lifecycle state management
- File attachments

## Creating a Part

1. Navigate to **Parts** in the sidebar
2. Click **New Part**
3. Fill in the required fields:
   - **Part Number**: Unique identifier (auto-generated if configured)
   - **Name**: Descriptive name
   - **Description**: Detailed description
   - **Material**: Material specification
   - **Unit of Measure**: EA, KG, LB, etc.
   - **Make/Buy**: Manufacturing decision

4. Click **Save**

## Part Properties

| Field | Description |
|-------|-------------|
| Part Number | Unique identifier |
| Name | Display name |
| Description | Detailed description |
| Material | Material specification |
| Weight | Component weight |
| Unit of Measure | Measurement unit |
| Make/Buy | Make in-house or buy from supplier |
| State | Lifecycle state (Draft, Review, Released, etc.) |

## Bill of Materials (BOM)

### Adding Components

1. Open a Part detail view
2. Navigate to the **BOM** tab
3. Click **Add Component**
4. Search for and select the child part
5. Enter the quantity
6. Click **Add**

### Viewing Where-Used

The **Where Used** tab shows all parent assemblies that use this part as a component.

## Revision Control

Parts support automatic revision control:
- New parts start at revision "A" (or "01" depending on configuration)
- Revisions are created through Change Orders
- Each revision maintains full audit history

## Graph Visualization

Use the **Graph** tab to visualize BOM relationships:
- Interactive node-based visualization
- Expand/collapse assemblies
- Navigate by clicking nodes

## Next Steps

- [Document Control](/user-guide/document-control) - Managing documents
- [Change Orders](/user-guide/change-orders) - Making changes to parts
