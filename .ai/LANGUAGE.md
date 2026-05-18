# ai-harness vocabulary

## Domain Terms

| Term | Meaning | Avoid |
| --- | --- | --- |
| **AI Harness** | The project-level system of config, files, rules, and CLI checks that keeps agent artifacts organized. | scaffold, template bundle |
| **Artifact Root** | The root directory configured by `.ai/config.json`, usually `.ai`. | docs root |
| **Artifact Path** | A named destination under `paths` in `.ai/config.json`. | folder, bucket |
| **Path Alias** | A configured legacy or wrong source path that maps into a canonical artifact path. | redirect, patch |
| **Managed Block** | A delimited section in an existing file that the CLI may refresh without touching surrounding human content. | generated file section |
| **Doctor Finding** | A reported harness issue classified as fixable or manual. | lint error |
| **Fixable Finding** | A doctor finding that `doctor --fix` may repair deterministically. | auto repair |
| **Manual Finding** | A doctor finding that needs human review before mutation. | failure |

## Commands

| Term | Meaning | Avoid |
| --- | --- | --- |
| **init** | Install or refresh managed harness files in a git repository. | sync, apply |
| **doctor** | Inspect harness drift without writing files. | dry run command |
| **doctor --fix** | Apply only safe deterministic repairs reported by `doctor`. | fix command, sync |

## Rules

- Say **Artifact Root** for the configured root, not docs root.
- Say **Path Alias** for configured path remapping, not patching.
- Say **Managed Block** for CLI-owned sections inside human files.
- Do not call third-party skill updating part of the MVP.
