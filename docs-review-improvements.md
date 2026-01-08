# Documentation Review & Improvements Guide

> **Review Date:** January 2026
> **Reviewer:** Claude + Human
> **Scope:** User-facing documentation pages (Getting Started, User Guide, Troubleshooting)

## Evaluation Criteria

Each page is evaluated against three criteria:

| Criterion | Description |
|-----------|-------------|
| **Helpfulness** | Does it explain *why* and *when*, not just *how*? Does it cover edge cases, gotchas, or real-world scenarios? Not just obvious "click here" walkthroughs. |
| **Visual Support** | Are there screenshots/GIFs for complex UI flows? Are they current and useful? |
| **Accuracy** | Does it match actual app behavior? Is implementation status clear for partial features? |

### Rating Scale
- ✅ **Good** - Meets the bar, minor tweaks only
- ⚠️ **Needs Work** - Significant gaps but salvageable
- ❌ **Poor** - Major rewrite or addition needed

---

## Getting Started Section

### 1. introduction.md

**File:** `docs/getting-started/introduction.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ⚠️ Needs Work | Too developer-centric, missing user perspective |
| Visual Support | ❌ Poor | No images at all |
| Accuracy | ✅ Good | Technical claims verified accurate |

#### Detailed Assessment

**Helpfulness Issues:**
- Opens with technical jargon ("Registry Pattern", "Zod schemas", "two-table pattern") that alienates end users
- Doesn't explain what problems Cascadia solves or who should use it
- Lists technical features but not user capabilities
- Missing target audience identification
- No concrete use cases or user stories

**Visual Support Issues:**
- Zero screenshots in the entire document
- An introduction page should set visual expectations for the product

**Accuracy Verification:**
| Claim | Status |
|-------|--------|
| Item types (Part, Document, Change Order, Requirement, Task) | ✅ Verified in app |
| Git-style versioning with branches | ✅ Confirmed in feature list |
| PostgreSQL + Drizzle ORM | ✅ Confirmed |
| TanStack Start framework | ✅ Confirmed |

**Minor accuracy concerns:**
- "PostgreSQL 18+" - verify this is the actual minimum version
- Missing "Project" from Built-In Item Types table (though mentioned under hierarchy)
- No implementation status indicators

#### Recommended Changes

1. **Add hero screenshot** of dashboard or key workflow at the top
2. **Reorder content structure:**
   - Lead with "What is Cascadia and who is it for?"
   - Then "What can you accomplish?"
   - Then technical details for those who care
3. **Add "What You Can Do" section** with user-focused bullet points:
   - Manage parts and BOMs with full revision history
   - Track engineering changes with Git-style branching
   - Control documents with check-in/check-out
   - etc.
4. **Add target audience callout** (hardware companies, medical device, aerospace, etc.)
5. **Move Registry Pattern details** to architecture.md (too technical for intro)
6. **Add a "Current Status" note** indicating this is pre-release software

---

### 2. installation.md

**File:** `docs/getting-started/installation.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ⚠️ Needs Work | Good structure but missing Docker option, incomplete env vars |
| Visual Support | ❌ Poor | No images |
| Accuracy | ❌ Poor | **Wrong default credentials**, outdated project structure |

#### Detailed Assessment

**Helpfulness Issues:**
- Missing Docker as an installation option (most users would prefer this)
- `.env` configuration only shows 2 vars but actual `.env.example` has many more (RabbitMQ, file storage, vault, SMTP, etc.)
- Troubleshooting section is minimal
- No explanation of when to use `db:push` vs `db:migrate`
- No guidance on Windows vs Mac/Linux differences beyond the one tip

**Visual Support Issues:**
- No screenshots of successful installation, database studio, or login screen
- Would benefit from showing expected terminal output

**Accuracy Issues (CRITICAL):**

| Item | Documentation Says | Actual |
|------|-------------------|--------|
| **Default Email** | `admin@example.com` | `admin@cascadia.local` |
| **Default Password** | `admin123` | `Cascadia` |
| **Seed command** | `npm run db:seed:test` | Does not exist (use `db:seed:powercart:history`) |

**Project structure is outdated:**
- Doc shows simplified `src/lib/` with only `db/`, `auth/`, `items/`
- Actual has 20+ directories: `api`, `config`, `errors`, `files`, `hooks`, `jobs`, `reports`, `services`, `sysml`, `vault`, `versioning`, `workflows`, etc.

**Missing from .env documentation:**
- `FILE_STORAGE_PATH` / `VAULT_ROOT` / `VAULT_TYPE`
- `RABBITMQ_URL` (required for jobs)
- `BASE_URL`
- OAuth provider configs

#### Recommended Changes

1. **FIX CREDENTIALS IMMEDIATELY** - Update to `admin@cascadia.local` / `Cascadia`
2. **Add Docker installation path** - Link to docker-compose.md or add a "Quick Start with Docker" section
3. **Update project structure** - Either make it accurate or remove it (it's not essential)
4. **Expand .env documentation** - Show all important variables with descriptions
5. **Remove `db:seed:test`** - Replace with actual available seed commands
6. **Add screenshots** showing:
   - Successful `npm run dev` output
   - Login page
   - Drizzle Studio
7. **Add platform-specific notes** for Windows PowerShell vs bash
8. **Link to deployment docs** for production setup

---

### 3. quick-start.md

**File:** `docs/getting-started/quick-start.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ❌ Poor | **STUB PAGE** - Just says "Coming Soon" |
| Visual Support | ❌ Poor | No content to have images |
| Accuracy | N/A | No substantive content |

#### Detailed Assessment

**This is a critical gap.** The quick-start page is just a placeholder with:
- A "Coming Soon" admonition
- A list of what it *would* cover (Parts, Documents, Change Orders, Graph Navigator)
- Links to other pages

A quick-start tutorial is one of the most important pages for new users. Without it, they have to piece together how to use the system from scattered documentation.

#### Recommended Changes

1. **HIGH PRIORITY: Write the actual tutorial** covering:
   - Logging in
   - Navigating to Parts
   - Creating a new Part with basic fields
   - Adding a Document to the Part
   - Creating a Change Order
   - Adding affected items to the ECO
   - Viewing the relationship graph

2. **Include screenshots for every step** - This should be the most visual page in the docs

3. **Add expected outcomes** - Show what success looks like at each step

4. **Consider a video walkthrough** or animated GIF for the complete flow

5. **Test the tutorial** end-to-end to ensure instructions match the actual UI

---

### 4. architecture.md

**File:** `docs/getting-started/architecture.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Well-written, explains "why" not just "what", includes trade-offs |
| Visual Support | ⚠️ Needs Work | ASCII diagrams are good, but could use real UI screenshots |
| Accuracy | ⚠️ Needs Work | Mostly accurate but directory structure simplified, route structure wrong |

#### Detailed Assessment

**Helpfulness Strengths:**
- Excellent "mental model" diagram at the top
- Each design decision includes rationale AND trade-offs
- Links to detailed docs for each topic
- Data flow examples are concrete and useful
- Good separation of concerns explanation

**Visual Support:**
- ASCII diagrams are appropriate for architecture docs
- Could benefit from real screenshots showing:
  - What Programs/Designs look like in the UI
  - The relationship graph visualization
  - The ECO workflow in action

**Accuracy Issues:**

| Item | Documentation | Actual |
|------|---------------|--------|
| Routes structure | Shows `routes/(app)/` subfolder | Flat structure: `routes/parts/`, `routes/documents/`, etc. |
| Services listed | 5 services | 9+ services (missing ConflictDetectionService, LifecycleService, ProgramService) |
| SolidWorks | "In progress" | Matches feature list ✅ |
| SysML 2.0 | "Complete" | Matches feature list ✅ |

**Minor issues:**
- "PostgreSQL 18+" - should verify this is accurate (18 is very new)
- Directory structure shows `vault/services/` but actual is `vault/` with files directly inside

#### Recommended Changes

1. **Fix routes directory structure** - Remove `(app)` reference, show actual flat structure
2. **Update services list** - Include all major services or say "key services include..."
3. **Verify PostgreSQL version** - 18+ seems aggressive, confirm minimum version
4. **Add 1-2 UI screenshots** showing Programs and Designs hierarchy in practice
5. **Consider adding** a diagram showing the relationship between Programs → Designs → Items → ECO Branches

---

## User Guide Section

### 5. parts-management.md

**File:** `docs/user-guide/parts-management.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Comprehensive coverage, explains workflows and best practices |
| Visual Support | ✅ Good | Has GIF animations showing key workflows |
| Accuracy | ⚠️ Needs Work | Minor UI differences, action buttons don't match |

#### Detailed Assessment

**Helpfulness Strengths:**
- Covers all major features: list view, creation, detail view, BOM, relationships, history
- Includes "Best Practices" section with naming conventions and tips
- Explains the revision control workflow clearly
- Field descriptions are useful

**Visual Support:**
- Uses animated GIFs: `create-part-workflow.gif`, `part-details-bom.gif`
- Captions explain what each GIF demonstrates
- This is a good model for other docs

**Accuracy Issues:**

| Item | Documentation | Actual UI |
|------|---------------|-----------|
| Header action buttons | "New Revision, Check Out, Delete" | "Edit, Delete" (no Check Out on main branch) |
| Design filter location | "dropdown in the top right" | Breadcrumb area (All Programs > All Designs) |
| BOM section | "Expand the BOM section, Click + Add" | Tab-based UI: "BOM Structure" / "Graph View" / "Table View" with "+ Add Relationship" |
| Summary cards | "Total Parts, Draft, In Review, Released" | Matches ✅ |
| Detail tabs | "Details, Relationships, History" | Matches ✅ |

**Minor issues:**
- The "+ Add" button for relationships is actually "+ Add Relationship"
- Graph view is now a tab, not an expand/collapse section

#### Recommended Changes

1. **Update header actions** - Fix the action buttons description (Edit/Delete, not New Revision/Check Out)
2. **Fix Design filter description** - It's in the breadcrumb area, not "top right"
3. **Update Relationships section** - Describe the tab-based UI (BOM Structure / Graph View / Table View)
4. **Verify GIFs are current** - Ensure the animated GIFs match the latest UI
5. **Minor:** Change "+ Add" to "+ Add Relationship" in BOM section

---

### 6. document-control.md

**File:** `docs/user-guide/document-control.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Covers check-in/out, file types, linking to parts |
| Visual Support | ❌ Poor | No screenshots or GIFs |
| Accuracy | ✅ Good | Matches actual UI structure |

#### Detailed Assessment

**Helpfulness Strengths:**
- Good explanation of check-in/check-out workflow
- Covers file types and upload limits
- Explains linking documents to parts
- Best practices section included

**Visual Support Issues:**
- No images at all
- Check-in/check-out workflow would benefit greatly from a GIF/screenshot
- Should show the file upload area

**Accuracy:**
- Summary statistics match actual UI (Total Documents, Draft, In Review, Released)
- Column descriptions accurate

#### Recommended Changes

1. **Add screenshots** showing:
   - Documents list view
   - Check-out status indicators
   - File upload area
2. **Add GIF** demonstrating check-in/check-out workflow
3. **Minor:** Verify 500 MB max file size matches actual configuration

---

### 7. change-orders.md

**File:** `docs/user-guide/change-orders.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Very comprehensive, covers lifecycle effects, guards, troubleshooting |
| Visual Support | ✅ Good | Has GIF for affected items workflow |
| Accuracy | ⚠️ Needs Work | Some workflow states don't match, missing Impact tab verification |

#### Detailed Assessment

**Helpfulness Strengths:**
- Excellent coverage of the ECO workflow concept
- Explains lifecycle effects in detail
- Guard types well documented
- Troubleshooting section helpful
- Best practices provided

**Visual Support:**
- Uses `eco-affected-items.gif`
- Could use additional screenshots for workflow transitions

**Accuracy Issues:**
- Workflow states shown (Impact Review → Technical Review → Approved) may not match default config
- "Impact" tab mentioned but need to verify it exists
- Need to verify approval voting UI matches docs

#### Recommended Changes

1. **Verify workflow states** match actual default ECO workflow configuration
2. **Add screenshot** of workflow transition buttons
3. **Verify Impact tab** exists in current UI or update doc
4. **Consider adding** screenshot of guard failure error message

---

### 8. requirements.md

**File:** `docs/user-guide/requirements.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ⚠️ Needs Work | Good structure but generic, no Cascadia-specific details |
| Visual Support | ❌ Poor | No screenshots |
| Accuracy | ⚠️ Needs Work | Summary cards may not match actual UI |

#### Detailed Assessment

**Helpfulness Issues:**
- Content reads like generic requirements management, not Cascadia-specific
- Missing details on how traceability actually works in the UI
- "Linking to Tests" section mentions test cases but Tasks ≠ Tests in Cascadia
- No mention of how to actually create relationships

**Visual Support Issues:**
- No images at all
- Would benefit from screenshots of:
  - Requirements list view
  - Requirement detail with traceability links

**Accuracy Issues:**
- Summary cards show "Proposed, Approved, Verified" - need to verify these are actual states
- "Linking to Tests" - verify if this is implemented or aspirational

#### Recommended Changes

1. **Add screenshots** of requirements list and detail views
2. **Clarify traceability UI** - how do you actually link requirements to parts?
3. **Verify summary statistics** match actual Requirements page
4. **Remove or clarify "Tests" references** - are these Tasks or a separate feature?
5. **Add Cascadia-specific guidance** instead of generic requirements management advice

---

### 9. tasks-kanban.md

**File:** `docs/user-guide/tasks-kanban.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ❌ Poor | **STUB PAGE** - Just "Coming Soon" |
| Visual Support | ❌ Poor | No content |
| Accuracy | N/A | No content to evaluate |

#### Detailed Assessment

Another critical stub page. The Tasks feature is implemented (visible in sidebar and feature list), but documentation is missing.

#### Recommended Changes

1. **HIGH PRIORITY: Write actual content** covering:
   - Tasks list view and Kanban board
   - Creating tasks
   - Task fields (assignee, due date, estimated hours, etc.)
   - Task states and workflow
   - Linking tasks to other items (ECOs, parts, etc.)
2. **Add screenshots** of Kanban board and task detail views
3. **Explain** how tasks integrate with Programs and Change Orders

---

### 10. workflows.md

**File:** `docs/user-guide/workflows.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Comprehensive explanation of lifecycle vs workflow, guards, effects |
| Visual Support | ✅ Good | Has workflow-builder.gif |
| Accuracy | ✅ Good | Well-aligned with feature list |

#### Detailed Assessment

**Helpfulness Strengths:**
- Excellent distinction between Lifecycles and Workflows
- Guard types thoroughly documented
- Lifecycle effects explained well
- Visual editor instructions comprehensive
- Best practices included

**Visual Support:**
- Uses `workflow-builder.gif`
- Static screenshots mentioned but not included
- References screenshots in static/img/screenshots/

**Accuracy:**
- Content matches feature list capabilities
- Action types documented align with implementation

#### Recommended Changes

1. **Minor:** Verify all action types (send_notification, etc.) are fully implemented
2. **Consider adding** more screenshots from static/img/screenshots/ (workflow-builder.png, etc.)
3. **Verify** default lifecycle definitions match actual configs

---

### 11. programs-and-designs.md

**File:** `docs/user-guide/programs-and-designs.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Explains hierarchy well, covers families and branches |
| Visual Support | ✅ Good | Has programs-designs.gif |
| Accuracy | ⚠️ Needs Work | Some UI elements may have changed |

#### Detailed Assessment

**Helpfulness Strengths:**
- Clear explanation of Program → Design → Items hierarchy
- Design families and variants well explained
- Branching concept tied to ECOs
- Tab descriptions comprehensive

**Visual Support:**
- Uses `programs-designs.gif`
- Good coverage of the conceptual hierarchy

**Accuracy Issues:**
- Header badges ("Main", "Change Control") - verify these exist
- Tab names (Structure, All Items, History, ECOs, Baselines) - verify accuracy
- "Archive" button - verify this exists

#### Recommended Changes

1. **Verify UI elements** against current app:
   - Header badges
   - Tab names
   - Action buttons
2. **Minor:** Update any changed terminology

---

## Troubleshooting Section

### 12. common-issues.md

**File:** `docs/troubleshooting/common-issues.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Practical solutions for real issues, good code examples |
| Visual Support | N/A | Technical troubleshooting doesn't need screenshots |
| Accuracy | ✅ Good | Technical solutions are sound |

#### Detailed Assessment

**Helpfulness Strengths:**
- Covers real issues (postgres bundling, connection errors, etc.)
- Provides multiple solutions for each problem
- Code examples are practical
- Cross-platform commands included

**Visual Support:**
- N/A - Troubleshooting docs are appropriately text-focused

**Accuracy:**
- Technical solutions are accurate
- Commands are correct for different platforms

#### Recommended Changes

1. **Add more common issues** as they're discovered
2. **Consider adding** "Before you ask for help" checklist
3. **Link to actual GitHub issues repo** (currently placeholder URL)

---

### 13. faq.md

**File:** `docs/troubleshooting/faq.md`

| Criterion | Rating | Summary |
|-----------|--------|---------|
| Helpfulness | ✅ Good | Covers common questions, well-organized |
| Visual Support | N/A | FAQ format doesn't need screenshots |
| Accuracy | ⚠️ Needs Work | Same credential/version issues as installation.md |

#### Detailed Assessment

**Helpfulness Strengths:**
- Well-organized by category
- Covers installation, features, security, performance
- Deployment options clearly listed

**Accuracy Issues:**
- **PostgreSQL 18+** - Same question about version accuracy
- **admin@example.com** reference in password reset SQL - should be admin@cascadia.local
- GitHub URL placeholder needs to be updated

#### Recommended Changes

1. **Fix admin email** in password reset SQL example
2. **Verify PostgreSQL version** requirement
3. **Update GitHub URLs** to actual repository
4. **Add more FAQs** as users ask questions

---

## Summary Statistics

| Section | Pages | ✅ Good | ⚠️ Needs Work | ❌ Poor |
|---------|-------|---------|---------------|---------|
| Getting Started | 4 | 1 | 2 | 1 |
| User Guide | 7 | 4 | 1 | 2 |
| Troubleshooting | 2 | 2 | 0 | 0 |
| **Total** | **13** | **7** | **3** | **3** |

### Rating Breakdown

**✅ Good (7 pages):**
- architecture.md
- parts-management.md
- document-control.md
- change-orders.md
- workflows.md
- programs-and-designs.md
- common-issues.md
- faq.md (helpfulness)

**⚠️ Needs Work (3 pages):**
- introduction.md (too developer-centric)
- requirements.md (generic content)
- faq.md (accuracy)

**❌ Poor (3 pages):**
- installation.md (wrong credentials, outdated structure)
- quick-start.md (STUB - Coming Soon)
- tasks-kanban.md (STUB - Coming Soon)

---

## Cross-Cutting Issues

Issues affecting multiple pages:

1. **CRITICAL: Wrong default credentials** - `admin@example.com` / `admin123` should be `admin@cascadia.local` / `Cascadia`
   - Affected: installation.md, faq.md

2. **PostgreSQL 18+ version** - Verify this is accurate (seems very new)
   - Affected: introduction.md, installation.md, architecture.md, faq.md

3. **Missing images in many docs** - Several pages have no screenshots
   - Affected: introduction.md, installation.md, document-control.md, requirements.md

4. **Stub pages** - Two pages are just "Coming Soon" placeholders
   - Affected: quick-start.md, tasks-kanban.md

5. **GitHub URL placeholders** - `your-org/cascadia` needs to be updated
   - Affected: common-issues.md, faq.md

---

## Action Items Priority

| Priority | Action | Pages Affected | Effort | Status |
|----------|--------|----------------|--------|--------|
| **Critical** | Fix default credentials (admin@cascadia.local / Cascadia) | installation.md, faq.md | Low | ✅ DONE |
| **High** | Write quick-start.md tutorial | quick-start.md | High | ✅ DONE |
| **High** | Write tasks-kanban.md documentation | tasks-kanban.md | Medium | ✅ DONE |
| **High** | Add hero screenshot to introduction | introduction.md | Low | ✅ DONE |
| **Medium** | Add screenshots to document-control.md | document-control.md | Low | ✅ DONE |
| **Medium** | Add screenshots to requirements.md | requirements.md | Low | ✅ DONE |
| **Medium** | Verify PostgreSQL version requirement | Multiple | Low | TODO |
| **Medium** | Update GitHub URLs | common-issues.md, faq.md | Low | TODO |
| **Medium** | Rewrite introduction for end-users | introduction.md | Medium | ✅ DONE |
| **Medium** | Improve requirements.md content | requirements.md | Medium | ✅ DONE |
| **Low** | Verify all UI elements match current app | Multiple | Medium | TODO |
| **Low** | Update project structure in installation.md | installation.md | Low | TODO |

### Screenshots Captured

The following screenshots were captured and added:

1. `static/img/screenshots/dashboard.png` - Added to introduction.md ✅
2. `static/img/screenshots/requirements-list.png` - Added to requirements.md ✅
3. `static/img/screenshots/documents-list.png` - Added to document-control.md ✅

---

## Existing GIFs/Screenshots

The following images already exist in `static/img/`:

**GIFs (animated):**
- `gifs/create-part-workflow.gif` - Used in parts-management.md
- `gifs/part-details-bom.gif` - Used in parts-management.md
- `gifs/eco-affected-items.gif` - Used in change-orders.md
- `gifs/programs-designs.gif` - Used in programs-and-designs.md
- `gifs/workflow-builder.gif` - Used in workflows.md

**Screenshots (static):**
- `screenshots/change-orders-list.png` - Not used
- `screenshots/lifecycle-effects-panel.png` - Not used
- `screenshots/lifecycles-list.png` - Not used
- `screenshots/workflow-builder.png` - Not used
- `screenshots/workflows-list.png` - Not used

**Recommendation:** Incorporate unused screenshots into relevant docs.
