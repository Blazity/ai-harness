# AI Harness Implementation Review

Date: 2026-05-18

Question: does the current `ai-harness` implementation match the goal of a simple, easy-to-add, framework-agnostic AI documentation tool?

## Verdict

The MVP is pointed in the right direction on the happy path: `npx @blazity/ai-harness init`, no runtime dependencies, a small command surface, config-driven artifact paths, and managed-block edits that avoid rewriting human prose.

The weak point is existing-repository safety. The CLI is meant to be safe and explicit, but several edge cases currently report success too easily, mutate when a user could reasonably expect a dry run, or classify conflicts as fixable before crashing.

## Confirmed Issues

### P1: `doctor --fix` bypasses dirty-worktree protection

README says mutating commands refuse dirty worktrees unless `--force` is passed. `init` checks `git status`, but `doctor --fix` applies fixes directly and has no `--force` path.

Evidence:

- `README.md:84`
- `src/init.js:14`
- `src/cli.js:24`

Verification: in a temporary repo with an unrelated dirty file, `doctor --fix` still moved `docs/superpowers/plans/plan.md` to `.ai/plans/plan.md`.

### P1: unsupported flags are silently ignored

`parseArgs` accepts any `--flag`, and handlers inspect only known names. This makes typos look successful. More importantly, `doctor --fix --dry-run` still mutates files even though the command text implies preview behavior.

Evidence:

- `src/cli.js:54`
- `src/cli.js:59`
- `src/cli.js:24`

Verification: `doctor --fix --dry-run` in a temp repo moved an alias file and exited `0`.

### P1: `init` hides manual conflicts

`collectDoctorFindings` can return manual findings such as invalid config, but `runInit` filters to fixable findings only and returns exit `0` with "No changes needed."

Evidence:

- `src/doctor.js:55`
- `src/init.js:11`
- `src/init.js:32`

Verification: invalid `.ai/config.json` made `init` print `No changes needed.` and exit `0`.

### P1: file/directory collisions are treated as fixable

Required artifact directories use `isDirectory`; if `.ai/plans` is a file, doctor reports a fixable `missing-directory`, then `doctor --fix` crashes in `mkdir`.

Evidence:

- `src/doctor.js:90`
- `src/actions.js:8`
- `src/repo.js:40`

Verification: replacing `.ai/plans` with a file caused `doctor --fix` to throw `EEXIST`.

### P2: absolute artifact paths are documented but not honored

README says absolute `artifactRoot` and path values are allowed. `resolveArtifactPath` returns absolute-looking paths, but later `repoPath(cwd, relativePath)` uses `path.join`, so `/tmp/ai-harness-abs` becomes `<repo>/tmp/ai-harness-abs`.

Evidence:

- `README.md:64`
- `src/config.js:70`
- `src/repo.js:51`

Verification: a config with `artifactRoot: "/tmp/ai-harness-abs-check"` caused `doctor --fix` to create `<repo>/tmp/ai-harness-abs-check`, not `/tmp/ai-harness-abs-check`.

### P2: skill symlink targets are not validated

Doctor checks that `.claude/skills`, `.agents/skills`, and `.cursor/skills` are symlinks, but not that they point to `../.ai/skills`. A wrong-but-valid symlink is considered clean.

Evidence:

- `src/doctor.js:159`
- `src/doctor.js:172`
- `test/doctor.test.js:89`

Verification: replacing `.claude/skills` with a symlink to `../other-skills` still made `doctor` report `No issues found.`

### P2: malformed managed-block markers are not treated as conflicts

If an existing `AGENTS.md` has a begin marker without a matching end marker, `applyManagedBlock` appends a fresh managed block. The conflict check then sees the new valid block and reports the issue as fixable instead of manual.

Evidence:

- `src/managed-blocks.js:8`
- `src/managed-blocks.js:14`
- `src/doctor.js:154`

Verification: a malformed `AGENTS.md` managed marker produced `missing-managed-block` as a fixable finding.

### P2: public npm publishing is not encoded

The package is scoped as `@blazity/ai-harness`, but `package.json` has no `publishConfig.access`. Current npm docs say scoped packages publish private by default unless published with `--access public`.

Evidence:

- `package.json:2`
- `README.md:11`
- npm docs: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/

### P3: pack smoke cleanup can leave tarballs after failures

The pack smoke test removes the tarball only after init/doctor succeed. If a failure happens between `npm pack` and cleanup, a generated `.tgz` can remain in the worktree.

Evidence:

- `test/pack-smoke.test.js:15`
- `test/pack-smoke.test.js:29`

## Product Concerns

### Confirmed: defaults are not fully neutral

The core artifact paths are framework-neutral, but the default aliases are Superpowers migration-specific and the CLI always manages Claude, `.agents`, and Cursor skill links. That may be correct for a cross-agent harness, but it is heavier than a pure documentation bootstrap.

Evidence:

- `src/config.js:19`
- `src/doctor.js:25`

### Plausible: starter content may be too sparse

The generated `LANGUAGE.md` and memory README are minimal. That helps simplicity, but a new user may not know what useful project memory, decisions, research, or vocabulary should look like.

Evidence:

- `src/templates.js:32`
- `src/templates.js:45`

## Strengths

- Small CLI surface: `init`, `init --dry-run`, `doctor`, `doctor --fix`.
- No runtime dependencies and Node `>=20`.
- No application-framework assumptions in package metadata or default artifact paths.
- Managed-block editing preserves human prose outside the harness block.
- Alias target collisions are manual and moves refuse overwrites.
- `npm pack --dry-run --json` confirms the package contains only `LICENSE`, `README.md`, `bin/`, `package.json`, and `src/`.

## Verification

Commands run:

- `npm test`: 16 tests passed.
- `npm pack --dry-run --json`: package contains 13 entries, no `.ai` or test files.
- `node bin/ai-harness.js --help`
- `node bin/ai-harness.js init --wat`
- `node bin/ai-harness.js doctor --unknown`
- `node bin/ai-harness.js init extra-arg`
- Temp-repo reproductions for dirty `doctor --fix`, `doctor --fix --dry-run`, invalid config during `init`, file/directory collision, wrong symlink target, malformed managed block, and absolute artifact root behavior.

## Recommended Order

1. Fix CLI argument validation and make `doctor --fix --dry-run` impossible or explicitly non-mutating.
2. Apply dirty-worktree protection consistently to `doctor --fix`, or change the README if the intended policy differs.
3. Make manual findings visible during `init` and return non-zero when the harness cannot be made healthy.
4. Reclassify filesystem type collisions as manual conflicts before mutation.
5. Decide whether absolute/out-of-root artifact paths are supported. Either honor them safely or reject them.
6. Decide whether skill links are core or optional. If core, validate targets. If optional, stop treating missing links as default drift.
7. Add tests for existing-repo edge cases, not only fresh-repo happy paths.
