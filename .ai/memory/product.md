# Product brief

## What ai-harness is

AI Harness is a config-driven CLI and repository convention for AI-agent-facing documentation. It installs a `.ai/` workspace, writes cross-agent instructions, and validates that plans, research, decisions, memory, and other AI artifacts land in the configured folders.

## Why it exists

AI agents often scatter plans and notes across tool-specific paths. AI Harness gives teams one project-owned source of truth for artifact locations and a deterministic CLI that catches drift when models ignore guidance.

## Who it's for

- Engineering teams using multiple AI coding agents in one repository.
- Maintainers who want repo-local AI documentation conventions without patching third-party skills.
- AI agents that need concise instructions for where project memory and work artifacts belong.

## Core architecture

`.ai/config.json` defines the artifact root, canonical paths, and path aliases. Agent instruction files tell models to respect that config, while the CLI validates and repairs mechanical drift through `doctor` and `doctor --fix`.

## Out of scope

- Third-party skill package management.
- Patching third-party skill internals.
- Telemetry, profiles, template marketplaces, and auto-commit workflows.
