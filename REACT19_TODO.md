# React 19 Migration Todo

## Goal

Move the repo's package development flow to React 19 while preserving published compatibility for React 18 consumers of `@trrack/vis-react`.

## Package Boundary

- [x] Keep `@trrack/vis-react` peer dependencies at `react` / `react-dom` `>=18 <20`.
- [x] Verify `@trrack/core` remains React-agnostic.
- [ ] Verify `@trrack/vis-react` tests pass against both React 18 and React 19.

## Tooling

- [x] Upgrade repo-level React testing utilities to versions that support React 19.
- [x] Upgrade repo-level `react`, `react-dom`, `@types/react`, and `@types/react-dom`.
- [x] Run package typecheck and test suites and fix runtime or typing regressions.

## Apps

- [x] Upgrade or isolate `apps/docs`, which currently depends on a React-18-only Next.js version.
- [ ] Upgrade or isolate `apps/react-trrack-example` dependencies that still peer only on React 18.
- [ ] Upgrade or isolate any other example app dependencies that block React 19.

## CI

- [ ] Add validation for React 18 package compatibility.
- [ ] Add validation for React 19 package compatibility.
- [ ] Document the tested support policy in package docs.

## Notes

- Current known blockers:
  - `next@13.1.1` peers only on React 18.
  - Some example app dependencies still peer only on React 18.
- Completed in this pass:
  - Upgraded the package-level React toolchain to React 19.
  - Upgraded `@testing-library/react` and added `@testing-library/dom`.
  - Upgraded `@react-spring/web` so `@trrack/vis-react` typechecks on the React 19 toolchain.
  - Adjusted one async integration test to avoid fake-timer polling assumptions under the newer runtime.
  - Migrated `apps/docs` from the old Pages Router + Nextra 2 setup to the App Router + Nextra 4 content-directory setup on React 19 / Next 16.
  - Verified `apps/docs` with `yarn workspace docs typecheck` and `yarn workspace docs build`.
- Start with package tooling, then move outward to apps and CI.
