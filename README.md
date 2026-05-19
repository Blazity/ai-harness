# ai-harness

Config-driven AI agent documentation harness for project repositories.

`ai-harness` installs a small `.ai/` workspace, writes cross-agent instructions, and validates that AI-generated artifacts stay in the configured folders. The CLI is the deterministic layer; agent rules are guidance.

## Install

Run in the root of a git repository:

```bash
npx @blazity/ai-harness init
```

Preview first:

```bash
npx @blazity/ai-harness init --dry-run
```

The installer is idempotent. It creates `.ai/config.json`, the configured `.ai/` folders, `AGENTS.md` managed instructions, a Claude shim, supported skill-discovery links, and a local `maintain-ai-harness` skill when it can do so safely.

After installation, ask your agent to use the `maintain-ai-harness` skill. The skill inspects the repository, asks only for missing domain context, and fills the first useful `AGENTS.md`, vocabulary, and memory files.

## Commands

```bash
npx @blazity/ai-harness init          # Install or refresh managed harness files
npx @blazity/ai-harness init --dry-run
npx @blazity/ai-harness doctor        # Inspect harness drift; no writes
npx @blazity/ai-harness doctor --fix  # Apply safe deterministic repairs
npx @blazity/ai-harness doctor --fix --force
```

`doctor` is the dry run for repairs. It reports fixable issues separately from manual conflicts. `doctor --fix` only applies the fixable set, and requires `--force` when the git worktree is dirty.

## Configuration

`.ai/config.json` is the source of truth for artifact locations:

```json
{
  "schemaVersion": 1,
  "artifactRoot": ".ai",
  "paths": {
    "language": "LANGUAGE.md",
    "memory": "memory",
    "plans": "plans",
    "research": "research",
    "decisions": "decisions",
    "adrs": "decisions/adrs",
    "results": "results",
    "skills": "skills"
  },
  "pathAliases": {
    "docs/superpowers/plans": "plans",
    "docs/superpowers/specs": "research",
    "docs/adrs": "decisions/adrs",
    "docs/specs": "research"
  }
}
```

Rules:

- `artifactRoot` is relative to the repository root unless absolute.
- `paths` values are relative to `artifactRoot` unless absolute.
- `pathAliases` keys are legacy or wrong locations relative to the repository root.
- `pathAliases` values are relative to `artifactRoot` unless absolute.

Agents are instructed to map conflicting skill/template paths through this config before reading or writing artifacts.

## Why Config, Not Patched Skills

Earlier versions explored vendoring third-party skills and patching hardcoded paths. That works, but it creates maintenance drift and makes updates fragile. The MVP uses a simpler model:

- `.ai/config.json` defines where artifacts belong.
- Agent instructions tell models to respect that config.
- `doctor` detects drift.
- `doctor --fix` moves files from explicit aliases into canonical folders.
- `maintain-ai-harness` handles semantic setup and later refreshes.

Third-party skills are optional. The CLI does not patch or update third-party skill internals.

## Agent-Led Setup and Refresh

The CLI intentionally does not ask product or architecture questions. It creates a local managed skill instead:

```text
.ai/skills/maintain-ai-harness/SKILL.md
```

Use that skill after first install and after major repository changes. It should inspect the codebase, ask focused questions for missing context, preserve human-authored content, and keep `AGENTS.md` concise.

## Safety Model

`init` requires a git repository. Mutating commands refuse to run on a dirty worktree when they have changes to apply unless `--force` is passed.

`doctor --fix` will:

- create missing configured folders;
- create missing default config and starter files;
- add or refresh managed instruction blocks;
- repair safe skill symlinks;
- restore the managed `maintain-ai-harness` skill;
- move files from explicit alias roots to canonical paths.

It will not:

- delete unknown files;
- infer new aliases;
- overwrite target conflicts;
- rewrite project prose outside managed blocks;
- patch third-party skills.

## Development

```bash
npm test
npm run pack:smoke
node bin/ai-harness.js --help
```

The package smoke test runs `npm pack`, installs the packed tarball into a temporary git repo, runs `init`, then runs `doctor`.

## Attribution

This project was informed by existing agent-workflow patterns, including Superpowers and public skill repositories. The current npm CLI does not install patched third-party skills by default. Any copied third-party material retained in this repository keeps its license and attribution next to the copied files.
