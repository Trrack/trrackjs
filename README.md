# Trrack

Trrack stands for **r**eproducible **track**ing. Originally Trrack is a web-based provenance tracking library that can track application state in directed provenance graph. The core library is framework-agnostic and can be used in any JavaScript/TypeScript application. The React visualization package provides components for rendering the provenance graph in a React application.

[![license](https://img.shields.io/github/license/trrack/trrackjs?style=plastic)](https://github.com/trrack/trrackjs/blob/main/LICENSE)
[![npm latest version](https://img.shields.io/npm/v/@trrack/core?style=plastic)](https://www.npmjs.com/package/@trrack/core)
[![npm downloads](https://img.shields.io/npm/dt/@trrack/core?style=plastic)](https://www.npmjs.com/package/@trrack/core)
[![GitHub Action](https://img.shields.io/github/actions/workflow/status/trrack/trrackjs/build_test_release.yml)](https://github.com/trrack/trrackjs/actions/workflows/build_test_release.yml)

## Table of Contents

- [Packages](#packages)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Developer Docs](#developer-docs)
    - [Development](#development)
    - [Testing and Linting](#testing-and-linting)
    - [Releasing](#releasing)

## Packages

- `@trrack/core`
  Core action-based provenance tracking library.
- `@trrack/vis-react`
  React components for rendering a Trrack provenance graph.

## Installation

Install the core package:

```bash
yarn add @trrack/core
```

Install the React visualization package with our peer dependencies:

```bash
yarn add react react-dom @trrack/core @trrack/vis-react
```

## Quick Start

For core usage, start with our [documentation](https://apps.vdl.sci.utah.edu/trrackjs/docs/tutorial/getting-started).

## Developer Docs

### Development

Install dependencies:

```bash
yarn install
```

Run the example apps:

```bash
yarn dev:react
yarn dev:dummy
yarn dev:lineup
yarn dev:docs
```

Run all dev targets at once:

```bash
yarn dev
```

### Testing and Linting

Build the published packages:

```bash
yarn build
```

Run package tests:

```bash
yarn test
```

Run package linting:

```bash
yarn lint
```

### Releasing

Packages are published from a GitHub Release via `.github/workflows/build_test_release.yml`.

Release flow:

1. Create a GitHub Release from the commit you want to publish.
2. Tag it as `v<version>` or `v<version>-<prerelease>`.
3. Mark prerelease releases as prereleases in GitHub.
4. Automatically generate release notes with the "Generate release notes" button in GitHub, or write your own release notes.
5. Publish the release.

The release workflow installs dependencies, builds and tests the packages, verifies package contents with `npm pack --dry-run`, and publishes both `@trrack/core` and `@trrack/vis-react` at the same version number.
