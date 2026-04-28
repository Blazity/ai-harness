# {{PROJECT}} vocabulary

<!--
This file is the canonical vocabulary for the project. Use the listed terms
exactly. Do not coin synonyms. If a needed concept is missing, add it here in
the same change that introduces it to the code.

Pattern (Matt Pocock's): one row per concept — `Term | Meaning | Don't say`.

The example terms below are GENERIC. Replace with your domain.
-->

## Domain terms

| Term         | Meaning                                                          | Don't say                  |
| ------------ | ---------------------------------------------------------------- | -------------------------- |
| **User**     | An authenticated principal — a person or service account         | account, member, person    |
| **Account** | The org/team a user belongs to (top-level isolation boundary)    | workspace, tenant, org     |
| **Resource** | A unit of work or content the product manages                    | item, entity, record       |
| **Field**    | A typed property on a resource                                   | column, attribute, prop    |

## Operations

| Term      | Meaning                                                | Don't say         |
| --------- | ------------------------------------------------------ | ----------------- |
| **Read**  | Fetch a resource without modifying it                  | get, fetch, query |
| **Write** | Create, update, or delete a resource                   | save, mutate      |

## Authorization

| Term        | Meaning                                                   | Don't say     |
| ----------- | --------------------------------------------------------- | ------------- |
| **API key** | Long-lived bearer token for non-interactive clients       | token, secret |
| **Session** | Browser-based interactive auth                            | cookie, login |
| **Scope**   | A permission claim attached to a key or session           | permission, role |

## Codebase shape

| Term          | Meaning                                                  | Don't say                                                  |
| ------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| **Workspace** | A package in the monorepo                                | project (overloaded), package (use only for npm packages)  |

## Forbidden

- {{ Term you do not want used }} — always say {{ canonical alternative }}.
- "Workspace" when referring to **account** — they're different concepts.
- "Plugin" when referring to a first-party **module** — modules are first-class. (Third-party concepts that genuinely call themselves plugins, e.g. TipTap plugins, can keep that name.)

<!--
After replacing the examples above with real terms, audit the codebase:

  grep -rE "<forbidden term>" --include='*.ts' --include='*.tsx' --include='*.md' .

If forbidden terms appear in your own code, fix them. Vendored / upstream code
that genuinely uses the term in a different sense (e.g. "TipTap plugin") is OK.
-->
