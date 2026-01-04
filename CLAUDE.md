# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Documentation site for Cascadia PLM, built with Docusaurus 3.9. Deployed to Firebase Hosting at docs.cascadiaplm.com.

**Requirements:** Node.js >= 20.0

## Common Commands

```bash
# Development
yarn start          # Start dev server at localhost:3000
yarn build          # Build static site to ./build
yarn deploy         # Build and deploy to Firebase
yarn deploy:preview # Deploy to preview channel
yarn typecheck      # Run TypeScript type checking
yarn clear          # Clear Docusaurus cache
```

## Architecture

### Key Behaviors

- **Broken links fail builds** - `onBrokenLinks: 'throw'` in config
- **Docs served from root** - `routeBasePath: '/'` (no `/docs/` prefix)
- **API Reference** - OpenAPI spec at `openapi/openapi.yaml` rendered via Redocusaurus at `/api-reference/`

### Screenshot Component

Use the `Screenshot` component for theme-aware images (auto-switches light/dark):

```tsx
import Screenshot from '@site/src/components/Screenshot';

<Screenshot
  name="parts-list"           // loads parts-list-light.png / parts-list-dark.png
  alt="Parts list view"
  category="user-guide"       // subdirectory under /img/screenshots/
/>
```

Images must exist at: `static/img/screenshots/{category}/{name}-light.png` and `-dark.png`

### Supported Code Block Languages

Prism languages: `bash`, `typescript`, `sql`, `yaml`, `json`, `nginx`

### Sidebar Configuration

Edit `sidebars.ts` to add/reorder documentation pages. The sidebar structure must match files in `docs/`.
