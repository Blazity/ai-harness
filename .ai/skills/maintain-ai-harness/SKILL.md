---
name: maintain-ai-harness
description: Use when a repository has AI Harness installed and needs initial agent setup, AGENTS.md refresh, AI memory updates, vocabulary cleanup, or review after major codebase changes
---

# Maintain AI Harness

## Overview

Use this skill after `ai-harness init` and after major repository changes. The CLI owns deterministic structure; this skill owns semantic repository understanding.

## Required Grounding

1. Read `.ai/config.json` first and resolve every artifact location through it.
2. Inspect the repository before asking questions: README, package metadata, lockfiles, framework configs, existing docs, tests, and agent instructions.
3. Run or ask the user to run `ai-harness doctor` before and after changes when the CLI is available.
4. Infer only obvious facts from code. Ask about product, domain, ownership, and workflow details that code cannot answer.

## Modes

### Initial setup

Use when the harness is new or mostly empty. Build the first useful AI context for the repository.

### Refresh

Use after major codebase, architecture, dependency, command, or product changes. Compare existing AI context with the current repository and update only stale or missing facts.

## Interview Rules

- Ask one focused question at a time.
- Do not ask questions that repository inspection can answer.
- Recommend a default answer when asking the user to choose.
- Mark unknowns explicitly instead of inventing facts.

Good questions cover: product purpose, target users, current direction, deploy/runtime expectations, architectural invariants, common pitfalls, safe commands, branch/release workflow, domain vocabulary, and external systems.

## Outputs

- Keep `AGENTS.md` concise and high-signal. Preserve human content and the AI Harness managed block.
- Fill `.ai/LANGUAGE.md` with canonical terms and avoided synonyms.
- Fill `.ai/memory/product.md`, `.ai/memory/architecture.md`, and `.ai/memory/stack.md` with stable facts only.
- Append `.ai/memory/lessons.md` only for proven non-obvious pitfalls.
- Do not create new artifact roots. Use `.ai/config.json` paths.

## Quality Bar

`AGENTS.md` should help an agent work safely within the first minute: what this repo is, how it is structured, what commands are safe, what rules matter, and what not to touch. Prefer short factual sections over long prose.
