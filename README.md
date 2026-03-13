# Trrack

Trrack stands for **r**eproducible **track**ing. Originally Trrack is a web-based provenance tracking library that can track application state in directed provenance graph.

This branch implements action based provenance tracking.

[![license](https://img.shields.io/github/license/trrack/trrackjs?style=plastic)](https://github.com/Trrack/trrackjs/blob/main/LICENSE)
[![npm latest version](https://img.shields.io/npm/v/@trrack/core?style=plastic)](https://www.npmjs.com/package/@trrack/core)
[![npm downloads](https://img.shields.io/npm/dt/@trrack/core?style=plastic)](https://www.npmjs.com/package/@trrack/core)
[![Github Action](https://img.shields.io/github/actions/workflow/status/trrack/trrackjs/build_test_release.yml)](https://github.com/Trrack/trrackjs/actions/workflows/build_test_release.yml)

## Releases

`@trrack/core` is published from a manually created GitHub Release.

1. Create a GitHub Release from the branch or commit you want to publish.
2. Use a tag in the format `v<version>`, for example `v2.0.3`.
3. Mark the GitHub Release as a prerelease when publishing alpha, beta, or other prerelease versions.
4. Publish the GitHub Release.

The `build_test_release.yml` workflow checks out the release tag, builds and tests the repo, and publishes `@trrack/core` to npm.


## Development

Clone the repository and switch to `trrack-action` branch.
This project was generated using [Nx](https://nx.dev). Please refer to [Nx](https://nx.dev) for more any questions about monorepo setup.

### Basic
Serve the react example by running the following:

```bash
npx nx react-trrack-example:serve
```
Any changes made to the `core` package will cause updates to the react example for easier testing

### Advanced
To get started with development run:

```bash
yarn install # Trrack can also work with npm, but it uses workspaces feature which we have only tested with yarn.

yarn dev:all # Will run all examples

yarn test:all:watch # Will run tests for all trrack pacakges in watch mode
```

The repository is structured as follows:

```bash
trrack-monorepo
|
|--- pacakges # trrack library is located in this folder
    |--- core # Core action-based tracking library
|
|--- apps # Trrack examples are located in this folder
    |--- react-trrack-example
```

Following the standards for Nx monorepos please install any dependency for the applications directly to root workspace. This ensures all the applications use same versions of any dependency. For the packages, install the dependency to appropriate package.
