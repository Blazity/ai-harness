# ai-harness

Config-driven AI agent documentation harness for project repositories.

`ai-harness` installs a small `.ai/` workspace, writes cross-agent instructions, and validates that AI-generated artifacts stay in the configured folders. The CLI is the deterministic layer; agent rules are guidance.

## Install

Public setup always goes through the published npm package. Do not copy this repository's `.ai/` folder or run local maintainer scripts to install AI Harness in another product repository.

Run in the root of a git repository:

```bash
npx --yes @blazity-atlas/ai-harness@latest init
```

Pick a deterministic starter template when you already know the repository shape:

```bash
npx --yes @blazity-atlas/ai-harness@latest init --template app
```

Available templates are `standard`, `library`, `app`, `monorepo`, and `agency`.

Preview first:

```bash
npx --yes @blazity-atlas/ai-harness@latest init --dry-run
```

The installer is idempotent. It creates `.ai/config.json`, the configured `.ai/` folders, `AGENTS.md` managed instructions, a Claude shim, supported skill-discovery links, and a local `setup` skill when it can do so safely.

After installation, ask your agent to use the `setup` skill. The skill inspects the repository, asks whether you want standard setup or repository-specific customization, and fills the first useful `AGENTS.md`, vocabulary, and memory files. If you choose customization, the skill lazy-loads its longer customization workflow from `setup/customization.md`.

You can also start from the skill first. In that flow the agent must still use the npm package through `npx`, checks whether AI Harness is installed, runs `init` or `doctor --fix` when safe, and only then continues into repository questions.

## Commands

```bash
npx --yes @blazity-atlas/ai-harness@latest init          # Install or refresh managed harness files
npx --yes @blazity-atlas/ai-harness@latest init --template app
npx --yes @blazity-atlas/ai-harness@latest init --dry-run
npx --yes @blazity-atlas/ai-harness@latest doctor        # Inspect harness drift; no writes
npx --yes @blazity-atlas/ai-harness@latest doctor --fix  # Apply safe deterministic repairs
npx --yes @blazity-atlas/ai-harness@latest doctor --fix --force
```

`doctor` is the dry run for repairs. It reports fixable issues separately from manual conflicts. `doctor --fix` only applies the fixable set, and requires `--force` when the git worktree is dirty.

## Configuration

`.ai/config.json` is the source of truth for artifact locations:

```json
{
  "schemaVersion": 1,
  "template": "standard",
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

## Templates and Customization

Templates are deterministic CLI presets. They choose the initial `.ai/config.json` shape and known path aliases for common repository types:

- `standard`: the default generic harness.
- `library`: API, release, compatibility, and documentation-oriented aliases.
- `app`: product, QA, runtime, and runbook-oriented aliases.
- `monorepo`: package, app, and workspace-oriented aliases.
- `agency`: client context, handoff, and delivery-oriented aliases.

Templates are not a substitute for repository understanding. After `init`, use the `setup` skill. It asks whether you want standard setup or customization. Standard setup fills stable context quickly; customization reads `setup/customization.md` and interviews you about artifact layout, enabled workflows, strictness, agent surfaces, vocabulary, safe commands, and optional project-local skills.

## Why Config, Not Patched Skills

Earlier versions explored vendoring third-party skills and patching hardcoded paths. That works, but it creates maintenance drift and makes updates fragile. The MVP uses a simpler model:

- `.ai/config.json` defines where artifacts belong.
- Agent instructions tell models to respect that config.
- `doctor` detects drift.
- `doctor --fix` moves files from explicit aliases into canonical folders.
- `setup` handles semantic setup and later refreshes.

Third-party skills are optional. The CLI does not patch or update third-party skill internals.

## Agent-Led Setup and Refresh

The CLI intentionally does not ask product or architecture questions. The npm package creates a local managed skill instead:

```text
.ai/skills/setup/SKILL.md
.ai/skills/setup/customization.md
```

Use that skill after first install and after major repository changes. It should inspect the codebase, ask focused questions for missing context, preserve human-authored content, and keep `AGENTS.md` concise. It only reads `customization.md` when the user opts into customization.

The skill can also be the first entrypoint, but it must not implement setup itself. Ask an agent to use the skill in a git repository and it should call the npm package:

```bash
npx --yes @blazity-atlas/ai-harness@latest doctor
npx --yes @blazity-atlas/ai-harness@latest init
npx --yes @blazity-atlas/ai-harness@latest doctor --fix
```

The skill must stop on manual conflicts and must not use `--force` unless the user explicitly approves it after a dirty-worktree refusal.

## Claude Code Plugin

AI Harness can also be installed as a thin Claude Code plugin through the Blazity Atlas marketplace:

```text
/plugin marketplace add Blazity/atlas
/plugin install ai-harness@blazity
/ai-harness:setup
```

The plugin only exposes the `setup` skill. It does not replace the npm package or duplicate installer logic; the skill still calls the same `npx --yes @blazity-atlas/ai-harness@latest ...` commands that a human would run.

## Safety Model

`init` requires a git repository. Mutating commands refuse to run on a dirty worktree when they have changes to apply unless `--force` is passed.

`doctor --fix` will:

- create missing configured folders;
- create missing default config and starter files;
- add or refresh managed instruction blocks;
- repair safe skill symlinks;
- restore the managed `setup` skill;
- move files from explicit alias roots to canonical paths.

It will not:

- delete unknown files;
- infer new aliases;
- overwrite target conflicts;
- rewrite project prose outside managed blocks;
- patch third-party skills.

## Development

These commands are for maintainers working inside this repository. Product repositories should use the npm package commands above.

```bash
npm test
npm run pack:smoke
node bin/ai-harness.js --help
```

The package smoke test runs `npm pack`, installs the packed tarball into a temporary git repo, runs `init`, then runs `doctor`.

## Attribution

This project was informed by existing agent-workflow patterns, including Superpowers and public skill repositories. The current npm CLI does not install patched third-party skills by default. Any copied third-party material retained in this repository keeps its license and attribution next to the copied files.
