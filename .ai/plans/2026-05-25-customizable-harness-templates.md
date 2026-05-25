# Customizable Harness Templates Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add deterministic CLI templates and opt-in setup-skill customization without making the CLI conversational.

**Architecture:** The CLI accepts explicit template input and uses template definitions to create the initial config and managed starter files. The setup skill remains the semantic entrypoint, asks whether the user wants customization, and lazy-loads `customization.md` only when the user opts in.

**Tech Stack:** Node.js ESM, built-in `node:test`, npm package smoke tests.

---

### Task 1: Template Config Selection

**Files:**
- Modify: `src/config.js`
- Modify: `src/cli.js`
- Modify: `src/init.js`
- Test: `test/config.test.js`
- Test: `test/doctor.test.js`

**Steps:**
1. Write failing tests for supported template names and `init --template app`.
2. Run the focused tests and confirm they fail because template support does not exist.
3. Add template definitions and CLI flag parsing.
4. Run the focused tests and confirm they pass.

### Task 2: Managed Customization Instructions

**Files:**
- Create: `skills/setup/customization.md`
- Modify: `skills/setup/SKILL.md`
- Modify: `src/templates.js`
- Modify: `src/doctor.js`
- Test: `test/doctor.test.js`
- Test: `test/pack-smoke.test.js`

**Steps:**
1. Write failing tests that `init` installs `customization.md` and `doctor --fix` restores it.
2. Run the focused tests and confirm they fail because the file is not managed.
3. Add the managed customization template and setup-skill lazy-load gate.
4. Run focused tests and confirm they pass.

### Task 3: Template UX and Documentation

**Files:**
- Modify: `README.md`
- Modify: `src/cli.js`
- Modify: `src/templates.js`
- Test: `test/doctor.test.js`
- Test: `test/pack-smoke.test.js`

**Steps:**
1. Write failing tests for help text and next-step wording.
2. Run focused tests and confirm they fail.
3. Update help, init output, and README to explain templates plus setup customization.
4. Run focused tests and the full suite.
