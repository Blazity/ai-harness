# ai-harness

## Vision

AI Harness gives project repositories a shared, config-driven AI documentation workspace. It creates a predictable `.ai/` structure, tells agents where artifacts belong, and provides a CLI that detects and repairs mechanical drift.

## Direction

The current focus is the npm CLI MVP: `init`, `doctor`, `doctor --fix`, and the managed `maintain-ai-harness` skill. The CLI should be safe to run in existing repositories, idempotent, and explicit about every mutation it applies.

## Repository Layout

| Path | What it is |
| --- | --- |
| `bin/` | Executable CLI entrypoint. |
| `src/` | CLI implementation, config resolution, doctor checks, and fix actions. |
| `test/` | Node test runner unit and integration tests. |
| `.ai/` | Repository-local AI artifact workspace and product memory. |
| `.ai/skills/maintain-ai-harness/` | Managed local skill installed by the CLI for semantic setup and refresh. |
| `scripts/` | Legacy manual apply script kept for reference during CLI transition. |

## Tech Stack

- **Runtime**: Node.js `>=20`
- **Module system**: ESM
- **Tests**: built-in Node test runner
- **Dependencies**: no required runtime dependencies for the MVP
- **Package manager**: npm

## Commands

```bash
npm test                         # Run unit, integration, and pack smoke tests
npm run pack:smoke               # Run only the packed-tarball smoke test
node bin/ai-harness.js --help    # Show CLI help
node bin/ai-harness.js init      # Install or refresh harness files
node bin/ai-harness.js doctor    # Inspect harness drift
node bin/ai-harness.js doctor --fix
node bin/ai-harness.js doctor --fix --force
```

## Architecture Patterns

`.ai/config.json` is the source of truth for artifact locations. Agent instructions are advisory; the CLI is the deterministic enforcement layer.

Managed edits must stay inside explicit managed blocks or generated files owned by the harness. Do not rewrite human prose outside managed blocks.

`doctor` is inspect-only and acts as the dry run for repairs. `doctor --fix` may only apply the fixable actions that `doctor` reports: creating configured folders, writing missing starter files, repairing safe symlinks, refreshing managed blocks, and moving files from explicit `pathAliases`. Mutating commands refuse dirty worktrees unless `--force` is passed.

The CLI must never infer new aliases, delete unknown files, overwrite target conflicts, patch third-party skills, auto-commit changes, or install hooks by default.

The `maintain-ai-harness` skill is the semantic layer. It may inspect the repository, ask domain questions, and update concise AI context, but it must still resolve all artifact paths through `.ai/config.json`.

## AI Agent Infrastructure

The `.ai/` directory at the repo root holds shared AI-agent-facing artifacts. It is team/project knowledge, not transient session state.

```text
.ai/
├── config.json               # Artifact root, canonical paths, and path aliases
├── LANGUAGE.md               # Project vocabulary
├── memory/                   # Durable product, architecture, stack, and lessons memory
├── plans/                    # Implementation plans
├── research/                 # Research artifacts
├── decisions/                # Decisions and ADRs
├── results/                  # Verification and run results
└── skills/                   # Optional project-local skills
```

**Rules for agents working in this repo:**

1. Read `.ai/config.json` before creating AI artifacts.
2. Map any conflicting artifact path through `artifactRoot`, `paths`, and `pathAliases`.
3. Use `.ai/LANGUAGE.md` for canonical naming.
4. Keep implementation plans in `.ai/plans/`.
5. Keep research in `.ai/research/`.
6. Keep decisions and ADRs under the configured decisions paths.
7. Update `.ai/memory/lessons.md` when a non-obvious pitfall is discovered.

## Development Workflow

For implementation tasks, write or update tests first, run them red, implement the smallest passing change, then rerun affected tests. Run `npm test` before reporting completion.

Branch from `main` using `feat/`, `fix/`, `chore/`, or `refactor/` prefixes. Use conventional commits.

## Release Checks

Before release, verify:

1. `npm test` passes.
2. `npm run pack:smoke` passes.
3. `node bin/ai-harness.js --help` works.
4. `node bin/ai-harness.js init --dry-run` works.
5. `node bin/ai-harness.js doctor` returns the expected status for this repo.

<!-- BEGIN AI-HARNESS: artifact-paths -->
## AI Harness Artifact Paths

`.ai/config.json` is the source of truth for AI artifact locations in this repository.
Before writing plans, research, decisions, ADRs, results, memory, vocabulary, or skill outputs, resolve the destination through `artifactRoot`, `paths`, and `pathAliases`.
If an imported skill, template, or instruction mentions a different path, map it through `.ai/config.json` before reading or writing files.
Do not create new documentation roots unless `.ai/config.json` explicitly allows them.
<!-- END AI-HARNESS: artifact-paths -->
