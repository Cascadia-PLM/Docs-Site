---
sidebar_position: 6
title: Contributing
---

# Contributing to Cascadia

We welcome contributions to Cascadia PLM! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Follow the [Development Setup](/development/setup) guide
4. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

### 1. Make Changes

Follow our [Code Conventions](/development/code-conventions) when writing code.

### 2. Write Tests

All new features should include tests:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage
```

See the [Testing Guide](/development/testing) for more details.

### 3. Format and Lint

```bash
# Format and lint fix
npm run check

# Or separately
npm run format
npm run lint
```

### 4. Commit Changes

Use conventional commit messages:

```
feat: add BOM relationship editing
fix: resolve login redirect loop
refactor: extract item validation logic
docs: update API documentation
test: add ItemService unit tests
chore: update dependencies
```

### 5. Create Pull Request

Push your branch and create a pull request:

```bash
git push origin feature/your-feature-name
```

Include in your PR:
- Clear description of changes
- Screenshots for UI changes
- Link to related issues

## Code Review

All PRs require review before merging:

- Code follows conventions
- Tests pass and cover new code
- Documentation is updated
- No security issues introduced

## Issue Guidelines

### Bug Reports

Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version)
- Error messages and stack traces

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternatives considered

## Architecture Decisions

For significant changes, discuss first:

1. Open an issue describing the change
2. Discuss approach with maintainers
3. Document decision in ADR format if needed

## Areas to Contribute

### Good First Issues

Look for issues labeled `good first issue`:
- Documentation improvements
- Bug fixes with clear reproduction steps
- Test coverage improvements

### Feature Development

- New item types
- UI improvements
- API enhancements
- Integration features

### Documentation

- User guides
- API documentation
- Example code
- Translations

## Community

### Communication

- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Pull Requests for contributions

### Code of Conduct

Be respectful and constructive. We're all working toward the same goal.

## License

Cascadia is licensed under AGPL-3.0. By contributing, you agree that your contributions will be licensed under the same license.

## Questions?

- Check existing documentation
- Search closed issues
- Open a discussion

Thank you for contributing to Cascadia!
