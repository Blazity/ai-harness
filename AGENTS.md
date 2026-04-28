# {{PROJECT}}

<!--
This file is the canonical prose-rules surface for AI agents working in this
repository. Codex, Cursor, Windsurf, and VS Code Copilot read it natively;
Claude Code reads it via the `@AGENTS.md` import in `CLAUDE.md`.

The sections marked with `{{ ... }}` placeholders or `<!-- TODO -->` comments
are project-specific and need to be filled in after the harness is applied.

Sections without placeholders are generic and should generally be left as-is.
-->

## Vision

{{ One paragraph describing what the product is and the problem it solves. }}

## Direction

{{ One paragraph on what the team is building right now and what's next.
   Reference upcoming major efforts (e.g. live preview, multi-tenancy).
   This is the "north star" snapshot — should change rarely. }}

## Repository layout

<!-- TODO: Replace with the actual top-level packages / apps / dirs. -->

| Path                | What it is                                              |
| ------------------- | ------------------------------------------------------- |
| `apps/<name>`       | {{ description }}                                       |
| `packages/<name>`   | {{ description }}                                       |

{{ One sentence on monorepo tooling — Bun workspaces, pnpm workspaces, Nx, Turborepo, etc. }}

## Tech Stack

<!-- TODO: Replace with actual stack. -->

- **Runtime**: {{ Bun / Node / Deno / ... }}
- **Build orchestration**: {{ Nx / Turborepo / pnpm scripts / ... }}
- **TypeScript**: {{ version, module resolution, strict, etc. }}
- **Backend**: {{ framework, ORM, database }}
- **Validation**: {{ Zod / Valibot / Standard Schema / ... }}
- **Infrastructure**: {{ Docker Compose services, queues, caches, storage }}

## Canonical planning docs

- Docs entrypoint: `docs/README.md`
- Live canonical specs: `docs/specs/README.md`
- Architecture decisions and rationale: `docs/adrs/README.md`

Read these before proposing changes to the areas they cover. The owning spec under `docs/specs/` and the linked issue are the source of truth for scope and acceptance criteria.

## Architecture patterns

<!-- TODO: Replace with the actual cross-cutting patterns of this codebase.

Common shapes worth documenting if they apply:
- Package boundary rules (which package owns what)
- Module / plugin system (if extensible)
- Conditional exports / dev-time source imports
- Validation strategy (where Zod / Valibot lives, validation boundaries)
- Tenant scoping (if multi-tenant)
- Test layering (unit / contract / integration)
- Schema or migration story
-->

**Package boundary rules**: {{ ... }}

**Module system**: {{ ... }}

**Tests**: {{ ... }}

## Commands

<!-- TODO: Replace with actual project commands. -->

```bash
{{ install }}                         # Install dependencies
{{ build }}                           # Build all packages
{{ typecheck }}                       # Typecheck
{{ check }}                           # Build + typecheck combined
{{ format }}                          # Format
{{ format:check }}                    # Format check (CI gate)
{{ unit }}                            # Unit tests
{{ integration }}                     # Integration tests
{{ ci:required }}                     # Full CI gate
```

## Working in this repo

- Branch from `main`: `feat/`, `fix/`, `chore/`, `refactor/` prefixes
- Conventional commits: `type(scope): message`
- Run the CI gate locally before pushing — CI will run the same gate on the PR.

## AI agent infrastructure

The `.ai/` directory at the repo root holds the team's shared AI-agent-facing artifacts. It's a team operating environment, not session state — read it for product knowledge and accumulated learnings, not for "what is someone working on right now" (that's the issue tracker).

```text
.ai/
├── LANGUAGE.md              # Project vocabulary — use these names, don't coin new ones
├── plans/                   # Implementation plans (committed; populated as new work happens)
├── research/                # Research artifacts (date-prefixed)
├── memory/                  # Team product memory (see .ai/memory/README.md)
│   ├── product.md           # Vision, audience, scope
│   ├── architecture.md      # System patterns, invariants, hard rules
│   ├── stack.md             # Runtime, deps, infrastructure
│   ├── lessons.md           # Append-only dev-time pitfalls
│   ├── topics/              # Cross-cutting domain knowledge
│   ├── integrations/        # External systems we depend on
│   └── initiatives/         # One file per major team effort
└── skills/                  # Vendored superpowers + project-local skills
```

**Rules for agents working in this repo:**

1. **Use `.ai/LANGUAGE.md` for naming.** Don't invent synonyms for existing terms.
2. **Read the relevant `.ai/memory/` file before non-trivial work** — `architecture.md` for invariants, `product.md` for product context, `initiatives/` for whether your work fits an active effort. Volatile state ("what's happening right now") lives in the issue tracker, not here.
3. **Append to `.ai/memory/lessons.md` when you hit a non-obvious pitfall.** One short entry; lead with the rule, then `Why:` and `How to apply:` lines.
4. **Plans live in `.ai/plans/`.** Use the superpowers `writing-plans` and `executing-plans` skills to write and run them. Plans are committed.
5. **Research goes in `.ai/research/`.** Date-prefixed filename (`YYYY-MM-DD-topic.md`).
6. **Major efforts get an initiative file** in `.ai/memory/initiatives/` (see that folder's README for the format). Update it on milestones; mark `Status: completed` when wrapping.
7. **Skills are auto-discovered** by Claude Code, Codex, and Cursor via symlinks (`.claude/skills`, `.agents/skills`, `.cursor/skills` all point to `../.ai/skills`). These are POSIX-style symlinks; on Windows they may not check out correctly without developer mode or `core.symlinks=true`. If skill discovery fails on a Windows clone, replace each symlink with a directory junction or a recursive copy of `.ai/skills/` as a fallback.

The vendored superpowers in `.ai/skills/` is the canonical copy used by every supported agent in this repo. The globally installed `superpowers` plugin is disabled at the project level via `.claude/settings.json` to prevent duplicate skill registration.

## Task workflow

For any implementation task:

1. Find the task in the issue tracker and extract scope, acceptance criteria, and dependencies.
2. Inspect full context from `docs/specs/README.md`, the owning spec under `docs/specs/`, and the linked issue, not only the single task block, to understand upstream and downstream constraints. Skim `.ai/memory/architecture.md` for invariants and `.ai/memory/initiatives/` for whether the work fits an active effort.
3. Map the task to affected packages and files.
4. Ship only what is in scope for that task.
5. While implementing in-scope work, shape code so future planned work fits cleanly and avoid short-term designs that block planned architecture.
6. Document new public contracts and operator workflows at point of use, including README updates, inline comments, CLI help, and API docs, as required by the task's acceptance criteria.
7. Run validations before finalizing.
8. If the task touched architecture, the stack, an integration, or an active initiative, update the relevant `.ai/memory/` file in the same change. If you discovered a non-obvious pitfall, append to `.ai/memory/lessons.md`.

If requirements conflict between an issue and the owning spec under `docs/specs/`, call it out explicitly and prefer the stricter interpretation until clarified.

## Spec-first enforcement

For every new implementation request that changes behavior, endpoint contracts, or public interfaces:

1. Verify first that the intended behavior is explicitly specified in the owning spec under `docs/specs/`.
2. If behavior is missing, ambiguous, or contradictory:
   - stop implementation,
   - send a spec-first nudge,
   - resume only after the spec is updated or confirmed.
3. Do not treat README notes or inferred code behavior as a substitute for spec.
4. If an issue and owning spec conflict, call it out and prefer the stricter interpretation until clarified.
5. Specs under `docs/specs/` must be standalone product documentation. Do not reference task IDs, issue numbers, or other external planning context inside spec content. If a spec needs rationale, keep it self-contained or use an ADR.

### Mandatory spec-first nudge template

Use this exact message template whenever scope is not fully specified:

`Spec-first gate: this behavior/endpoint is not fully specified in the owning spec under docs/specs yet. Please update that spec (or confirm exact contract changes) first, then I will implement strictly against that spec delta.`

### Pre-implementation spec coverage checklist

Before writing code, confirm:

1. Endpoint or behavior exists in the owning spec under `docs/specs/`.
2. Auth mode and required scopes are defined.
3. Request and success response contracts are defined.
4. Deterministic error codes and statuses are defined.
5. CLI and operator workflow notes are defined where applicable.

### Required spec delta summary

For each task, provide a short `spec delta` summary before implementation planning or execution:

1. What changed in the owning spec under `docs/specs/`.
2. Which endpoint, contract, or behavior is affected.
3. Which acceptance criteria depend on this spec delta.

### Standalone spec rule

Hard rule:

1. Treat every file under `docs/specs/` as standalone canonical product documentation.
2. Do not write task identifiers (e.g. `PROJ-123`) or any other issue/task references inside specs.
3. Do not refer to issue trackers, "this task", or similar planning context inside specs.
4. If implementation planning context matters, keep it in ADRs, plans, or the issue tracker, not in `docs/specs/`.

## Package boundary rules

<!-- TODO: List the actual packages and their ownership boundaries. -->

- {{ Package A }}: {{ what it owns, what it must not do }}
- {{ Package B }}: {{ ... }}

When moving code across packages, preserve clear ownership and avoid circular dependencies.

## Linting and formatting policy

- {{ Prettier / ESLint / etc. }} is enabled and should be used.
- Do not add or require lint targets or config unless the active task explicitly includes lint baseline work.

## Commit and change hygiene

- Make focused, task-scoped commits.
- Don't include unrelated local folders or tooling artifacts. `.gitignore` enforces what stays local.
- Follow conventional commit message format: `type(scope): message`.

Before commit, ensure:

1. Format check passes.
2. Build + typecheck passes.
3. Task-specific verification steps for the change are satisfied.
