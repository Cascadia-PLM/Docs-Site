---
sidebar_position: 3
title: Quick Start
---

# Quick Start Tutorial

Get started with Cascadia PLM in 10 minutes. This tutorial walks you through creating your first part, document, and change order.

## Prerequisites

Before starting, make sure you have:
- Cascadia PLM installed and running (see [Installation Guide](/getting-started/installation))
- Logged in with admin credentials (`admin@cascadia.local` / `Cascadia`)

## Step 1: Understand the Dashboard

After logging in, you'll see the dashboard with summary statistics for your system:

- **Parts** - Manufacturing components with BOM relationships
- **Documents** - Version-controlled files and specifications
- **Requirements** - Trackable product requirements
- **Change Orders** - ECOs for managing engineering changes

The sidebar on the left provides navigation to all features.

## Step 2: Create Your First Part

Parts are the core items in Cascadia. They represent physical components, assemblies, or materials.

1. Click **Parts** in the sidebar
2. Click **+ Create Part** in the top right
3. Fill in the required fields:

| Field | Value | Notes |
|-------|-------|-------|
| **Design** | Select your design | Parts must belong to a design |
| **Name** | `Widget Assembly` | Descriptive name for the part |
| **Make/Buy** | `Make` | Whether you manufacture or purchase |
| **Material** | `Aluminum` | Optional material specification |

4. Leave **Item Number** blank to auto-generate (e.g., `PN-000001`)
5. Click **Create Part**

Your part is created in **Draft** state, meaning you can edit it freely.

## Step 3: View Part Details

Click on your new part to see its detail view. You'll find several tabs:

- **Details** - Core information and attributes
- **BOM** - Bill of materials (child components)
- **Where Used** - Parent assemblies that use this part
- **Relationships** - Links to documents, requirements, etc.
- **Files** - Attached files and drawings
- **History** - Revision history and changes

## Step 4: Add a Document

Documents in Cascadia are version-controlled files like specifications, drawings, or procedures.

1. Click **Documents** in the sidebar
2. Click **+ Create Document**
3. Fill in the fields:

| Field | Value |
|-------|-------|
| **Design** | Select your design |
| **Name** | `Widget Assembly Drawing` |
| **Type** | `Drawing` |

4. Click **Create Document**
5. On the document detail page, use **Upload File** to attach your file

## Step 5: Link Document to Part

Create traceability by linking your document to the part:

1. Open your Widget Assembly part
2. Go to the **Relationships** tab
3. Click **+ Add Relationship**
4. Search for and select your document
5. The relationship now shows in both directions

## Step 6: Create a Change Order

Change Orders (ECOs) are how you make controlled changes to released items. Even for draft items, using an ECO is good practice.

1. Click **Change Orders** in the sidebar
2. Click **+ Create Change Order**
3. Fill in the fields:

| Field | Value |
|-------|-------|
| **Name** | `Initial release of Widget Assembly` |
| **Change Type** | `ECO - Engineering Change Order` |
| **Priority** | `Medium` |
| **Reason for Change** | `New product introduction` |

4. Click **Create Change Order**

## Step 7: Add Items to Your ECO

The ECO creates an isolated workspace (branch) for your changes:

1. Open your new ECO
2. Go to the **Affected Items** tab
3. Click **+ Add Item**
4. Search for and add your Widget Assembly part
5. The part is now associated with this ECO

## Step 8: Submit for Review

When you're ready to release your changes:

1. On the ECO detail page, click **Submit for Review**
2. The ECO moves to **In Review** state
3. Reviewers can approve or reject the changes
4. Once approved, click **Release** to merge changes to main

After release:
- Parts get their revision letter incremented (A → B)
- Changes are recorded in the history
- Items become available on the main branch

## Key Concepts to Remember

### Lifecycle States

Items move through lifecycle states:
- **Draft** - Editable, not yet controlled
- **In Review** - Under review for approval
- **Released** - Officially released, changes require ECO

### ECO-as-Branch Model

Cascadia uses Git-style branching:
- Each ECO creates an isolated branch
- Multiple ECOs can work on the same item simultaneously
- Changes merge on release without blocking others

### Designs and Programs

- **Programs** are top-level containers (projects, product lines)
- **Designs** are versioned workspaces within programs
- All items belong to a design

## Next Steps

Now that you've created your first items:

- [Parts Management](/user-guide/parts-management) - Learn about BOMs and assemblies
- [Change Orders](/user-guide/change-orders) - Deep dive into ECO workflows
- [Document Control](/user-guide/document-control) - File management and versioning
- [Requirements](/user-guide/requirements) - Requirements traceability
