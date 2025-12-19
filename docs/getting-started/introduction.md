---
sidebar_position: 1
title: Introduction
---

# Introduction to Cascadia PLM

Cascadia is an open-source, code-first Product Lifecycle Management (PLM) system built with TanStack Start. It replaces traditional low-code PLM systems (like Aras Innovator) with a developer-centric, type-safe approach where all customization happens in code, not through UI configuration.

## Key Philosophy

- **Code-First Configuration** - TypeScript everywhere with full IDE support
- **Enterprise-Ready** - PostgreSQL backend with proven scalability
- **Extensible Architecture** - Event-driven design for custom workflows and integrations

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | TanStack Start (full-stack TypeScript with file-based routing) |
| **Database** | PostgreSQL 18+ with Drizzle ORM |
| **UI** | Tailwind CSS 4 + Radix UI components |
| **Auth** | @oslojs/crypto + @oslojs/encoding + Arctic (OAuth) |
| **Validation** | TanStack Form + Zod |
| **Graph Visualization** | React Flow (@xyflow/react) + Dagre for layout |
| **Testing** | Vitest + Playwright |

## Core Features

### Item Type Registry Pattern

The system uses a **Registry Pattern** for managing different item types. All item types:

1. Extend the `BaseItem` interface
2. Have a Zod schema for validation
3. Register their configuration including UI components, permissions, and metadata
4. Share a common `items` table for base fields + type-specific tables for additional fields

### Built-In Item Types

| Item Type | Description |
|-----------|-------------|
| **Part** | Manufacturing parts with BOM relationships |
| **Document** | File attachments and documentation |
| **Change Order** | ECO/ECN change management |
| **Requirement** | Requirements tracking |
| **Task** | Work items with Kanban support |

### Organizational Hierarchy

- **Program** - Business initiative/contract (permission boundary)
- **Design** - Version container for items (maps to SysML Project)

### Git-Style Versioning

Cascadia supports SysML 2.0-inspired versioning:

- **Designs** as version containers with branches and commits
- **Branches** for ECOs and workspaces (`main`, `eco/*`, `workspace/*`)
- **Commits** as immutable snapshots with parent chain
- **Tags** for named baselines

## Why Cascadia?

| Traditional PLM | Cascadia PLM |
|-----------------|--------------|
| Configure item types through UI wizards | Define types in TypeScript with full IDE support |
| Export/import XML for version control | Git-native configuration with code review |
| Proprietary scripting languages | Standard TypeScript/JavaScript ecosystem |
| Vendor lock-in with licensing fees | Open source with AGPL license |
| Black-box deployments | Docker/Kubernetes with full control |

## Next Steps

- [Installation Guide](/getting-started/installation) - Set up your development environment
- [Quick Start](/getting-started/quick-start) - Create your first items
- [Architecture Overview](/getting-started/architecture) - Understand the system design
