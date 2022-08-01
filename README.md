# Trrack

Trrack stands for **r**eproducible **track**ing. Originally Trrack is a web-based provenance tracking library that can track application state in directed provenance graph.

This branch implements action based provenance tracking.

## Development

Clone the repository and switch to `trrack-action` branch.
This project was generated using [Nx](https://nx.dev). Please refer to [Nx](https://nx.dev) for more any questions about monorepo setup.

To get started with development run:

```bash
yarn install # Trrack can also work with npm, but it uses workspaces feature which we have only tested with yarn.

yarn dev:all # Will run all examples

yarn test:watch:all # Will run tests for all trrack pacakges in watch mode
```

The repository is structured as follows:

```bash
trrack-monorepo
|
|--- pacakges # trrack library is located in this folder
    |--- core # Core action-based tracking library
    |--- redux # Redux toolkit wrapper for core
|
|--- apps # Trrack examples are located in this folder
    |--- react-trrack-example
    |--- rtk-trrack-example
```

Following the standards for Nx monorepos please install any dependency for the applications directly to root workspace. This ensures all the applications use same versions of any dependency. For the packages, install the dependency to appropriate package.
