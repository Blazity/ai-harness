# AI Harness Follow-Up Review

Date: 2026-05-19

Scope: fresh review of the current `feat/ai-harness-cli` workspace after the May 19 fixes for the first implementation audit.

## Verdict

The May 19 fixes address the highest-risk first-pass issues, but the current implementation still has several repository-safety and config-source-of-truth gaps. The most important theme is that not every subsystem actually follows `.ai/config.json`: artifact directories do, but skill discovery links and placeholder checks still assume default `.ai` paths.

## Confirmed Issues

### P1: custom `artifactRoot` breaks skill-link idempotency

`addSkillLinkFindings` hard-codes `.claude/skills`, `.agents/skills`, and `.cursor/skills` to point at `../.ai/skills` instead of deriving the target from `resolveArtifactPath(config, "skills")`.

With `artifactRoot: ".harness"`, `doctor --fix --force` creates `.harness/skills`, then creates `.claude/skills -> ../.ai/skills`. That target is broken, so the next `doctor` reports the same skill links as missing again.

Evidence:

- `src/doctor.js:25`
- `src/doctor.js:65`
- `src/doctor.js:168`

Repro result: `doctor --fix --force` exited `0`, `readlink(".claude/skills")` was `../.ai/skills`, and the next `doctor` exited `1` with `missing-skill-link` findings.

### P1: `pathAliases` keys can escape the repository

`validateConfig` rejects absolute alias keys, but accepts `..` traversal. `addAliasFindings` then runs `repoPath(repoRoot, aliasRelativePath)` and recursively lists that directory. `doctor --fix --force` can rename files from outside the repo into `.ai`.

Evidence:

- `src/config.js:56`
- `src/config.js:60`
- `src/doctor.js:211`
- `src/doctor.js:218`

Repro result: a config with `"../outside-alias": "plans"` reported `../outside-alias/nested/leak.md should move to .ai/plans/nested/leak.md`; `doctor --fix --force` moved the parent-directory file into the repo.

### P1: alias roots that are files crash `doctor`

Default aliases are treated as directories. If a repo already has `docs/specs` as a file, `addAliasFindings` sees that it exists and calls `readdir` through `listFiles`, causing an uncaught `ENOTDIR` instead of a manual finding.

Evidence:

- `src/doctor.js:214`
- `src/doctor.js:218`
- `src/doctor.js:275`
- `src/doctor.js:276`

Repro result: with `docs/specs` as a regular file, `runCli(["doctor"])` threw `ENOTDIR: not a directory, scandir .../docs/specs`.

### P2: malformed managed-block markers are still treated as fixable

The current conflict check tests `hasManagedBlock(nextAgents, managedBlockId)` after `applyManagedBlock` has already appended a fresh valid block. A file with a begin marker but no end marker is therefore reported as fixable `missing-managed-block`, leaving the malformed marker in place.

Evidence:

- `src/doctor.js:137`
- `src/doctor.js:141`
- `src/doctor.js:163`
- `src/managed-blocks.js:10`
- `src/managed-blocks.js:14`

Repro result: an `AGENTS.md` containing only `<!-- BEGIN AI-HARNESS: artifact-paths -->` plus partial body produced a fixable `missing-managed-block` finding, not a manual conflict.

### P2: duplicate managed blocks are considered clean

`managedBlockPattern` is not global, so `applyManagedBlock` updates only the first matching block. If `AGENTS.md` contains two valid `artifact-paths` blocks with the current body, `doctor` exits clean.

Evidence:

- `src/managed-blocks.js:10`
- `src/managed-blocks.js:22`

Repro result: after `init`, duplicating the managed block in `AGENTS.md` still made `doctor` exit `0` with `No issues found.`

### P3: placeholder detection ignores configured language paths

`addPlaceholderFindings` checks only `AGENTS.md` and `.ai/LANGUAGE.md`. If config changes `paths.language` to `VOCAB.md`, unresolved placeholders in `.ai/VOCAB.md` are not detected.

Evidence:

- `src/doctor.js:200`
- `src/doctor.js:201`
- `src/doctor.js:203`

Repro result: with `paths.language: "VOCAB.md"`, replacing `.ai/VOCAB.md` with `# {{TODO}}` left `doctor` clean.

### P3: pack-smoke tarball cleanup is still not failure-safe

The packed tarball is removed only after the install and doctor assertions. If `npm exec`, `init`, `doctor`, or either assertion fails, the generated `.tgz` can remain in the working tree.

Evidence:

- `test/pack-smoke.test.js:15`
- `test/pack-smoke.test.js:29`

## Likely False Positives / Not Re-raised

- Dirty-worktree enforcement for `doctor --fix` appears fixed.
- Unknown flags are now rejected, including `doctor --fix --dry-run`.
- Invalid config and configured artifact file/directory collisions are surfaced as manual findings.
- Absolute artifact roots are honored for artifact directories and files.
- `publishConfig.access: "public"` is present.

## Verification

Commands and checks run:

- `npm test`: 23 tests passed.
- focused temp-repo repros for custom artifact roots, alias-root file crash, alias `..` traversal, malformed managed blocks, duplicate managed blocks, and custom language placeholder drift.
