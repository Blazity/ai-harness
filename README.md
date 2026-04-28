# ai-harness

A reusable, team-shared AI agent harness skeleton. Drop the `.ai/` directory and supporting files into any project to get:

- A canonical `AGENTS.md` read natively by Codex, Cursor, Windsurf, and VS Code Copilot, plus a one-line `CLAUDE.md` shim for Claude Code.
- A `.ai/memory/` bank for persistent team product knowledge — product / architecture / stack / lessons / topics / integrations / initiatives.
- A `.ai/LANGUAGE.md` vocabulary file.
- A `.ai/plans/` directory for committed implementation plans, plus `.ai/research/` for date-prefixed research artifacts.
- Vendored `obra/superpowers` skills (MIT) at `.ai/skills/`, with the global plugin disabled per project so the vendored copy is the single source of truth.
- Symlinks `.claude/skills`, `.agents/skills`, `.cursor/skills` → `../.ai/skills` so Claude Code, Codex, and Cursor 2.4+ all discover the same skill set without duplication.

This is a **scaffold** — the templates have placeholders. After applying it to a target repo, fill in the project-specific sections (vision, tech stack, vocabulary, etc.).

## Why this shape

Designed for a **team** working on a product, not a single developer across sessions. The split between stable docs (product / architecture / stack), append-only logs (lessons), per-entity files (topics, integrations, initiatives), and external volatile state (issue tracker) avoids the merge-conflict problems that solo-developer "memory bank" patterns hit on concurrent PRs.

Reference: the original meeting notes and the OSS landscape research that drove this design are kept private in the team's working notes; the skeleton here distills the conclusions, not the deliberation.

## Apply to a repo

### Option A — clone + copy

```bash
git clone https://github.com/Blazity/ai-harness ~/tmp/ai-harness
rsync -av --exclude '.git' --exclude 'README.md' --exclude 'scripts/' \
  ~/tmp/ai-harness/ /path/to/your/project/
cd /path/to/your/project
ln -s ../.ai/skills .claude/skills
ln -s ../.ai/skills .agents/skills
ln -s ../.ai/skills .cursor/skills
```

### Option B — `scripts/apply.sh`

```bash
git clone https://github.com/Blazity/ai-harness ~/tmp/ai-harness
~/tmp/ai-harness/scripts/apply.sh /path/to/your/project
```

The script copies the skeleton, recreates the symlinks (which don't survive `cp` reliably), and prints a checklist of placeholders to fill in.

### Option C — patch file

```bash
git clone https://github.com/Blazity/ai-harness ~/tmp/ai-harness
cd ~/tmp/ai-harness && git format-patch --root --stdout > /tmp/ai-harness.patch
cd /path/to/your/project && git am /tmp/ai-harness.patch
```

Cleanest for repos that don't already have `AGENTS.md` / `CLAUDE.md`. Conflicts on overlap.

## After applying

Walk through these placeholders:

- `AGENTS.md` — `## Vision`, `## Direction`, `## Repository layout`, `## Tech Stack`, `## Architecture patterns`, `## Commands`, `## Working in this repo`, `## Package boundary rules`. Replace `{{PROJECT}}` and project-specific descriptions.
- `.ai/LANGUAGE.md` — replace example domain terms with your own.
- `.ai/memory/product.md` — fill in vision, audience, scope.
- `.ai/memory/architecture.md` — list invariants and patterns.
- `.ai/memory/stack.md` — runtime, deps, infra.
- `.ai/memory/topics/` — start adding cross-cutting domain files as concepts stabilize.
- `.ai/memory/integrations/` — document external systems your repo actually depends on.
- `.ai/memory/initiatives/` — first file when an active multi-week effort kicks off.
- `.claude/settings.json` — confirm the `superpowers@claude-plugins-official` plugin should be disabled (it should, if you use the vendored copy).

## Bumping vendored superpowers

`.ai/skills/README.md` documents the procedure. Short version: copy from `~/.claude/plugins/cache/claude-plugins-official/superpowers/<NEW_VERSION>/skills/` over `.ai/skills/`, update the version pin in `.ai/skills/README.md`, smoke-test in a fresh session.

## Status

Phase 1 — manual scaffold. Phase 2 (deferred): an installer skill (`/install-ai-harness`) that detects target-repo state, prompts for project-specific values, and patches placeholders interactively.
