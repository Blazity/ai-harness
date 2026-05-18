# Topics

Cross-cutting domain knowledge for AI Harness. Topics here should explain concepts that span multiple implementation files, such as path aliasing, managed blocks, or hook behavior.

## Format

One file per topic. Filename `kebab-case.md`. Each file should answer four questions:

1. **What is it?** — one paragraph; the concept and its boundaries.
2. **How does it work?** — the actual flow, with cross-refs to packages and files.
3. **What guarantees / invariants?** — what must always be true.
4. **Cross-refs.** — pointers to specs, ADRs, code, and other topics.

Keep each file under ~150 lines. If it grows beyond that, split it.

## Index

(none yet)

## When to add a topic

When you find yourself explaining a cross-cutting concept twice — to a teammate, to an AI agent, in a PR description — that's the signal. Write it down here once and link from the next conversation.
