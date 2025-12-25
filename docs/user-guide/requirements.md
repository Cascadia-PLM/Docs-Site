---
sidebar_position: 4
title: Requirements
---

# Requirements Management

Requirements in Cascadia PLM help you capture, track, and verify product requirements throughout the development lifecycle. Link requirements to parts and tests to ensure complete traceability.

## Requirements List Overview

The Requirements page displays all requirements with summary statistics and filtering options.

### Summary Statistics

At the top of the page, you'll see four summary cards:

| Statistic | Description |
|-----------|-------------|
| **Total Requirements** | Count of all requirements |
| **Proposed** | Requirements in initial proposal state |
| **Approved** | Requirements that have been approved |
| **Verified** | Requirements that have been verified through testing |

### Filtering and Search

- **Design Filter**: Filter requirements by design
- **Search**: Find requirements by item number or name
- **Column Sorting**: Click column headers to sort

## Creating a Requirement

1. Navigate to **Requirements** in the sidebar
2. Click **+ Create Requirement** in the top right
3. Fill in the requirement details:

### Required Fields

| Field | Description |
|-------|-------------|
| **Design** | The design this requirement belongs to |
| **Item Number** | Unique identifier (auto-generated, e.g., REQ-1001) |
| **Revision** | Version identifier (default: A) |

### Optional Fields

| Field | Description |
|-------|-------------|
| **Name** | Descriptive name (e.g., "User Authentication") |
| **Description** | Detailed requirement statement |
| **Type** | Requirement type (Functional, Performance, etc.) |
| **Priority** | Importance level (High, Medium, Low) |
| **Status** | Current verification status |
| **Source** | Who requested this requirement |
| **Category** | Classification category |
| **Acceptance Criteria** | Criteria for verification |

4. Click **Create Requirement** to save

## Requirement Types

Cascadia supports various requirement types:

| Type | Description |
|------|-------------|
| **Functional** | What the product must do |
| **Performance** | Speed, capacity, efficiency targets |
| **Interface** | Integration and connectivity needs |
| **Safety** | Safety-related requirements |
| **Regulatory** | Compliance and certification needs |
| **Environmental** | Operating environment constraints |

## Requirement Properties

### Priority Levels

| Priority | Description |
|----------|-------------|
| **Critical** | Must-have for product release |
| **High** | Important for customer satisfaction |
| **Medium** | Desired but not essential |
| **Low** | Nice-to-have features |

### Status States

| Status | Description |
|--------|-------------|
| **Proposed** | Initial requirement capture |
| **Approved** | Requirement has been reviewed and approved |
| **In Progress** | Implementation underway |
| **Verified** | Testing confirms requirement is met |
| **Rejected** | Requirement was not approved |

## Requirement Traceability

### Linking to Parts

Requirements can be linked to parts to show:
- Which parts implement which requirements
- Coverage analysis for requirement fulfillment
- Impact assessment when requirements change

### Linking to Tests

Requirements can be linked to test cases to show:
- Verification method for each requirement
- Test results and verification status
- Gaps in test coverage

## Requirement Hierarchies

### Parent-Child Structure

Requirements can be organized hierarchically:

```
System Requirement
  - Subsystem Requirement
      - Component Requirement
```

### Decomposition

Break down high-level requirements:
1. Start with system-level requirements
2. Decompose into subsystem requirements
3. Further decompose to component requirements
4. Link components to implementing parts

## Verification Tracking

### Verification Methods

| Method | Description |
|--------|-------------|
| **Test** | Verified through testing |
| **Demonstration** | Verified through demonstration |
| **Analysis** | Verified through analysis or simulation |
| **Inspection** | Verified through visual inspection |

### Acceptance Criteria

Define clear acceptance criteria for each requirement:
- Measurable success conditions
- Test procedures to follow
- Expected results

## Revision Control

Requirements follow the same revision control as parts:

### Making Changes

- Released requirements cannot be modified directly
- Create an ECO to revise requirements
- Work on requirements in the ECO branch
- When released, revision increments

### Change Impact

When requirements change:
1. Review linked parts for impact
2. Update implementation as needed
3. Re-verify affected requirements

## Best Practices

### Writing Requirements

- Use clear, unambiguous language
- Make requirements testable
- Include acceptance criteria
- Avoid implementation details

### Organization

- Use consistent naming conventions
- Organize by category or subsystem
- Maintain requirement hierarchies
- Keep requirements atomic (one requirement per statement)

### Traceability

- Link all requirements to implementing parts
- Link requirements to verification tests
- Review traceability regularly
- Update links when designs change

## Next Steps

- [Parts Management](/user-guide/parts-management) - Creating parts that implement requirements
- [Change Orders](/user-guide/change-orders) - Managing requirement changes
- [Programs and Designs](/user-guide/programs-and-designs) - Organizing requirements in designs
