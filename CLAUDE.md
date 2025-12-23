# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the documentation site for Cascadia PLM, built with Docusaurus 3.9. The site is deployed to Firebase Hosting at docs.cascadiaplm.com.

## Common Commands

```bash
# Development
yarn start          # Start dev server at localhost:3000
yarn dev            # Same as above

# Build and deploy
yarn build          # Build static site to ./build
yarn deploy         # Build and deploy to Firebase
yarn deploy:preview # Deploy to preview channel

# Utilities
yarn typecheck      # Run TypeScript type checking
yarn clear          # Clear Docusaurus cache
yarn serve          # Serve production build locally
```

## Architecture

### Documentation Structure

- `docs/` - Markdown documentation files organized by section
  - `getting-started/` - Installation, quick-start, architecture overview
  - `user-guide/` - Parts, documents, change orders, requirements, tasks, workflows
  - `admin-guide/` - User management, permissions, lifecycle, configuration
  - `deployment/` - Docker, Kubernetes, cloud database deployment guides
  - `development/` - Setup, architecture, conventions, testing for CascadiaApp
  - `api/` - REST API reference
  - `troubleshooting/` - Common issues and FAQ

### Key Configuration Files

- `docusaurus.config.ts` - Site configuration (title, URLs, navbar, footer, themes)
- `sidebars.ts` - Documentation sidebar structure
- `src/css/custom.css` - Custom theme styles
- `src/components/` - Custom React components (HomepageFeatures, Screenshot)

### Routing

- Docs are served from root (`/`) due to `routeBasePath: '/'` config
- Blog is disabled
- Uses `@easyops-cn/docusaurus-search-local` for search functionality

### Deployment

- Hosted on Firebase Hosting
- `yarn deploy` builds and deploys to production
- Preview channels available via `yarn deploy:preview`
