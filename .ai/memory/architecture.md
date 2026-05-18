# Architecture

## Source of truth

`.ai/config.json` is canonical for artifact locations. Agent rules are guidance, and generated files are working copies that the CLI may refresh through managed blocks.

## Module Boundaries

- `bin/`: executable entrypoint only.
- `src/config.js`: config defaults, validation, and path resolution.
- `src/doctor.js`: drift detection and fix planning.
- `src/actions.js`: filesystem mutations for already-approved fix actions.
- `src/managed-blocks.js`: insertion and replacement of CLI-owned sections.
- `src/cli.js`: command routing and process-facing behavior.
- `test/`: behavior coverage for config, doctor, init, and package smoke.

## Cross-Cutting Invariants

- `doctor` never writes files.
- `doctor --fix` only applies explicit fixable findings.
- Managed file edits stay inside AI Harness managed blocks unless the whole file is missing and owned by the harness.
- Alias moves are only allowed for configured `pathAliases`.
- Existing target files are never overwritten.
- Third-party skills are not patched or updated by the MVP CLI.

## Tests

Use the built-in Node test runner via `npm test`. Tests cover unit-level config/block behavior, temp-repo integration flows, alias moves, collision handling, idempotent init, and packed-tarball execution.

## Release Safety

The packed smoke test is part of the normal test suite. It proves the npm package tarball contains the executable and source files needed to run `init` and `doctor` in a fresh git repository.
