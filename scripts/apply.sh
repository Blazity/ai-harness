#!/usr/bin/env bash
# Apply the ai-harness skeleton to a target repo.
#
# Usage: scripts/apply.sh <target-repo-path>
#
# What it does:
#   1. Copies the harness skeleton (everything except scripts/ and the harness's own README.md/.git)
#      into the target repo, refusing to overwrite existing files.
#   2. Recreates the three skill symlinks (.claude/skills, .agents/skills, .cursor/skills → ../.ai/skills).
#   3. Prints a checklist of placeholder files the adopter still needs to fill in.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <target-repo-path>" >&2
  exit 1
fi

TARGET="$(cd "$1" && pwd)"
HARNESS="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -d "$TARGET/.git" ]; then
  echo "Refusing to apply: $TARGET is not a git repository (no .git directory)." >&2
  exit 2
fi

echo "Applying ai-harness skeleton from"
echo "  $HARNESS"
echo "into"
echo "  $TARGET"
echo

# Copy without clobbering existing files. rsync's --ignore-existing is the safe default.
rsync -av --ignore-existing \
  --exclude '.git' \
  --exclude 'scripts' \
  --exclude 'README.md' \
  --exclude '.agents/skills' \
  --exclude '.claude/skills' \
  --exclude '.cursor/skills' \
  "$HARNESS/" "$TARGET/"

# Recreate symlinks (rsync doesn't reliably create them on every filesystem).
cd "$TARGET"
mkdir -p .claude .agents .cursor
[ -L .claude/skills ] || ln -s ../.ai/skills .claude/skills
[ -L .agents/skills ] || ln -s ../.ai/skills .agents/skills
[ -L .cursor/skills ] || ln -s ../.ai/skills .cursor/skills

echo
echo "Done. Next steps:"
echo
echo "  1. Open AGENTS.md and replace the {{PROJECT}} / {{...}} placeholders"
echo "     and the <!-- TODO --> blocks with actual project content."
echo "  2. Open .ai/LANGUAGE.md and replace the example domain terms."
echo "  3. Open .ai/memory/{product,architecture,stack}.md and fill them in."
echo "  4. Confirm .gitignore — at minimum it should exclude .claude/settings.local.json."
echo "  5. If the adopter project does NOT use Prettier, delete .prettierignore."
echo "  6. Smoke-test: open the project in Claude Code / Codex / Cursor and"
echo "     confirm vendored skills are discoverable. The global superpowers plugin"
echo "     should be disabled by .claude/settings.json — confirm no duplicate"
echo "     'superpowers:*' skill registrations."
echo
echo "  See README.md in the harness repo for the full adoption checklist."
