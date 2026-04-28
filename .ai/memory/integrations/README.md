# Integrations

External systems {{PROJECT}} depends on or integrates with. One file per system. Document what we use it for, how it's configured, and what failure modes look like — so a new contributor (or agent) can debug or replicate the setup without reverse-engineering it from config files.

## Index

<!-- TODO: Add an entry per external system the project actually integrates
     with. Examples:

- docker-stack.md       — Local infrastructure via docker-compose.yml
- github-actions.md     — CI gates and workflow files in .github/workflows/
- <vendor-api>.md       — Third-party APIs (Stripe, Sentry, Auth0, etc.)
- <internal-service>.md — Sister services in the org

Skip integrations that are user-local only (personal MCP servers, locally
installed CLI tools). Anything documented here should be true for any
contributor cloning the repo.
-->

(none yet)

## Format

For each integration:

1. **What it is + why we use it.**
2. **Configuration** — where the config lives, what's in it, what's local-only vs committed.
3. **How agents interact with it** (if applicable) — MCP servers, CLI tools, auth setup.
4. **Failure modes** — common breakages and how to recognize them.
5. **Cross-refs.**
