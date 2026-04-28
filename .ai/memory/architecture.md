# Architecture

<!--
Architecture invariants and key technical decisions. Update when one changes.
Include the rules that should always hold, not the day-to-day patterns
(those go in topics/) or the rationale for past decisions (those go in
docs/adrs/).
-->

## Source of truth

{{ What is canonical for content / state / schema, and what is a working copy.
   Example: "The database is canonical, not the filesystem; CLI files are a
   working copy reconciled via push/pull." }}

## Module / extensibility system

{{ If applicable: how the codebase is extended without patching core. }}

## Package boundaries (hard rules)

- {{ Package A }}: {{ what it owns, what it must not do }}
- {{ Package B }}: {{ ... }}

## Cross-cutting invariants

- {{ e.g. "Every persistable tenant-scoped row carries `account_id`. Auth tables are user-bound, not tenant-bound." }}
- {{ e.g. "All inputs validated with Zod at module boundaries; once parsed, downstream code trusts the type." }}
- {{ e.g. "No runtime ORM relations across modules — use foreign-key IDs only." }}

## Tests

{{ How tests are layered. Where unit, contract, integration tests live and how
   they're run. The CI gate. }}

## Standalone specs

Files under `docs/specs/` are **standalone canonical product documentation**. No task IDs, no external planning references, no "this task" language. Spec rationale either stays self-contained or moves to an ADR.

## Multi-tenant boundaries

{{ If applicable: the isolation model. Account, environment, locale, etc. How
   queries are scoped. What's tenant-bound vs user-bound. }}
