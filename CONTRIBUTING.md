# Contributing

We do not have strict rules for contributing

Every opinion and desire to help is always welcome

Before contributing, we recommend read [Code of Conduct](CODE_OF_CONDUCT.md)

# Development

## Commit Message Conventions

We recommend use [AngularJS Git Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153#format-of-the-commit-message)

## Branch Naming Conventions

We recommend use this Git Branch Naming Convention or similar

### `<type>/<name>`

#### `<type>`

```
feature
bugfix
fix
refactor
```

#### `<name>`

Always use dashes to seperate words, and keep it short

### Examples

```
feature/renderer-cookies
fix/dockerfile-base-image
bugfix/login-ie
```

## Code Style

We use ESLint, Prettier and Husky hook `pre-commit` for fix code style problems

## Tests

We use Jest for testing and Husky hook `pre-commit` for running tests locally. Tests are also run on CI

#### If you have an idea to improve this file or change contribution rules, you can write about this in [Open Discussion Issue](https://github.com/artemirq/zero-scripts/issues/15) or create separated issue
