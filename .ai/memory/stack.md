# Stack

## Runtime + Tooling

- Node.js `>=20`
- Native ESM
- npm package with bin `ai-harness`
- Built-in Node test runner

## Dependencies

No runtime dependencies are required for the MVP. Prefer standard library APIs for filesystem, path, process, and child-process behavior.

## Validation

Config validation is implemented directly in `src/config.js`. Do not add a schema library unless validation becomes materially more complex.

## Infrastructure

There is no server, database, frontend, Docker service, or deployed docs site in the MVP.

## Constraints

- Keep the CLI deterministic and local.
- Do not introduce telemetry.
- Do not auto-install git hooks by default.
- Do not patch third-party skills.
- Do not mutate human-authored prose outside managed blocks.
