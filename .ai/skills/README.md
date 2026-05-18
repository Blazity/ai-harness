# Skills

This directory is the configured skill location for this repository. Every supported agent can discover it via a symlink:

- `.claude/skills` → `../.ai/skills`
- `.agents/skills` → `../.ai/skills`
- `.cursor/skills` → `../.ai/skills`

Skill format is the [Anthropic Agent Skill (`SKILL.md`)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) standard.

## Current repository copy

This source repository still contains a legacy vendored Superpowers snapshot so existing local development sessions can keep using those workflows while the CLI MVP lands. The npm CLI does not install patched third-party skills by default.

## Vendored Superpowers attribution

The skills below are vendored from [obra/superpowers](https://github.com/obra/superpowers) v5.0.7, MIT-licensed (see `LICENSE.superpowers`). Copyright (c) 2025 Jesse Vincent. To bump the version:

```bash
SP_VER=5.x.x

# If you have the global plugin installed, copy from its cache:
cp -r ~/.claude/plugins/cache/claude-plugins-official/superpowers/$SP_VER/skills/. .ai/skills/
cp ~/.claude/plugins/cache/claude-plugins-official/superpowers/$SP_VER/LICENSE .ai/skills/LICENSE.superpowers

# Otherwise, clone the upstream repo and copy from there:
git clone --depth 1 --branch v$SP_VER https://github.com/obra/superpowers /tmp/superpowers
cp -r /tmp/superpowers/skills/. .ai/skills/
cp /tmp/superpowers/LICENSE .ai/skills/LICENSE.superpowers

# Update the version pin above and verify by running a smoke test in a fresh session.
```

Vendored skills (v5.0.7):

- `brainstorming/`
- `dispatching-parallel-agents/`
- `executing-plans/`
- `finishing-a-development-branch/`
- `receiving-code-review/`
- `requesting-code-review/`
- `subagent-driven-development/`
- `systematic-debugging/`
- `test-driven-development/`
- `using-git-worktrees/`
- `using-superpowers/`
- `verification-before-completion/`
- `writing-plans/`
- `writing-skills/`

## Project-local skills

Project-specific skills live alongside the vendored ones in this directory. To create one, drop a `<skill-name>/SKILL.md` here following the [Anthropic SKILL.md format](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview).

Personal / per-developer skills should be gitignored — add the path to your repo's `.gitignore` (e.g. `.ai/skills/<my-personal-skill>/`) so it doesn't ship to teammates.

## Historical path patches

The old scaffold patched vendored Superpowers skills from `docs/superpowers/` into `.ai/` paths:

- `docs/superpowers/specs/` → `.ai/research/`
- `docs/superpowers/plans/` → `.ai/plans/`

The CLI MVP replaces this patching model with `.ai/config.json` plus `pathAliases`. Do not add new third-party patching automation for the MVP.

Historical patch command:

```bash
for f in \
  .ai/skills/brainstorming/spec-document-reviewer-prompt.md \
  .ai/skills/brainstorming/SKILL.md \
  .ai/skills/writing-plans/SKILL.md \
  .ai/skills/requesting-code-review/SKILL.md \
  .ai/skills/subagent-driven-development/SKILL.md; do
  sed -i '' \
    -e 's|docs/superpowers/specs/|.ai/research/|g' \
    -e 's|docs/superpowers/plans/|.ai/plans/|g' \
    "$f"
done
```
