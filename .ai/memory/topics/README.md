# Topics

Cross-cutting domain knowledge — things that don't belong to a single package. Per-package details live in `apps/*/AGENTS.md` and `packages/*/AGENTS.md`. Architectural decisions live in `docs/adrs/`. Specs live in `docs/specs/`. **Topics here are integration-level**: how concepts flow across packages, what guarantees the system makes, what's idiomatic.

## Format

One file per topic. Filename `kebab-case.md`. Each file should answer four questions:

1. **What is it?** — one paragraph; the concept and its boundaries.
2. **How does it work?** — the actual flow, with cross-refs to packages and files.
3. **What guarantees / invariants?** — what must always be true.
4. **Cross-refs.** — pointers to specs, ADRs, code, and other topics.

Keep each file under ~150 lines. If it grows beyond that, split it.

## Index

<!-- TODO: Add topic files as concepts stabilize. Examples that often warrant
     their own file:

- auth-flow.md           — how session / API key / device flow weave across surfaces
- data-sync.md           — file ↔ DB or client ↔ server reconciliation lifecycle
- multi-tenancy.md       — isolation rules across the data layer
- module-system.md       — how extensions mount surfaces
- schema-sync.md         — schema/migration story
- caching.md             — caching strategy and invalidation
- background-jobs.md     — queue/worker model

Don't pre-create files. Add when a real concept stabilizes.
-->

(none yet)

## When to add a topic

When you find yourself explaining a cross-cutting concept twice — to a teammate, to an AI agent, in a PR description — that's the signal. Write it down here once and link from the next conversation.
