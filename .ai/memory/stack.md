# Stack

<!--
Runtime, dependencies, and infrastructure. Update when any of them change.
-->

## Runtime + tooling

- {{ Runtime: Bun / Node / Deno / ... }}
- {{ Build orchestration: Nx / Turborepo / pnpm / ... }}
- {{ TypeScript version, module resolution, strict mode }}

## Backend

- {{ HTTP framework }}
- {{ ORM / driver / database }}
- {{ Cache, queue, object storage if applicable }}

## Frontend

- {{ Framework — React / Vue / Svelte / ... }}
- {{ Data layer — TanStack Query / SWR / ... }}
- {{ UI / component libraries }}

## Validation

- {{ Zod / Valibot / Standard Schema / ... }}

## Infrastructure (dev)

- {{ docker compose up — what services come up }}
- {{ Local ports, env file conventions }}

## Constraints worth knowing

- {{ Runtime constraints — e.g. "Bun-only, do not introduce Node-only deps" }}
- {{ Architecture rules pulled from architecture.md that affect dependency choices }}
- {{ Pre-commit / pre-push gates }}

## Things that are NOT in the stack (yet)

- {{ Notable absences with rationale: "No CRDT (real-time collab is post-MVP)" }}

## Repository services

- Issue tracker: {{ ... }}
- CI: {{ ... }}
- Docs deploy: {{ ... }}
