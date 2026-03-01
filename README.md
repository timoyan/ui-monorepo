# UI Monorepo

This repository contains a UI app package managed as a pnpm workspace.

**New to the repo?** → **[docs/ONBOARDING.md](docs/ONBOARDING.md)** — first-time setup, daily commands, conventions, troubleshooting.

## Packages

- **`packages/nextjs-pandacss-ark`** – Next.js 16 app (Pages Router) with PandaCSS and Ark UI (`Button`, `Accordion`, etc.).
  - Package docs entrypoint: see `packages/nextjs-pandacss-ark/README.md` (`Docs` section).

Development is set up for **VS Code + Gemini Code Assistant**. Canonical project rules live in **AGENTS.md**; Gemini instructions in `.gemini/instructions.md` point to AGENTS.md.

## Tech Stack

- **Next.js 16** (Pages Router)
- **PandaCSS** – Build-time CSS-in-JS
- **Ark UI** – Headless, accessible components
- **Tooling**: pnpm workspaces, Biome (lint/format), Husky + lint-staged

## Getting Started

### Installation

From the repo root:

```bash
pnpm install
```

### Build

```bash
pnpm -r build
```

This builds `packages/nextjs-pandacss-ark`.

### Run Dev Server

```bash
pnpm --filter nextjs-pandacss-ark dev
```

### Unit Tests

```bash
pnpm test
# or
pnpm --filter nextjs-pandacss-ark run test:run
```

See [docs/UNIT_TESTING.md](docs/UNIT_TESTING.md) for testing conventions (Redux isolation, MSW, no snapshot tests).

## Linting & Formatting (Biome)

- **Lint**: `pnpm lint`
- **Format check**: `pnpm format`
- **Format write**: `pnpm format:write` or `pnpm format -- --write`

Biome is configured in `biome.json` at the repo root.

## Git Hooks (Husky + lint-staged)

- `prepare` installs Husky.
- **Pre-commit** runs `lint-staged`: format and lint staged files with Biome. Unfixable issues block the commit.
- **Pre-push** runs the app build (`pnpm --filter nextjs-pandacss-ark run build`) so broken builds are caught before push.

## Docs

- **Repo-level**
  - [docs/ONBOARDING.md](docs/ONBOARDING.md) – onboarding, setup, daily workflow, conventions
  - `AGENTS.md` – AI/code rules and commit conventions
  - `docs/` – CI, migration, pnpm overrides, dependency policy, etc.

- **`packages/nextjs-pandacss-ark`**
  - [README](packages/nextjs-pandacss-ark/README.md) – app overview and package docs
  - [ARCHITECTURE.md](packages/nextjs-pandacss-ark/ARCHITECTURE.md) – structure and layers
  - [docs/UNIT_TESTING.md](docs/UNIT_TESTING.md) – testing guide (Redux, MSW, no snapshots)
  - [docs/PHILOSOPHY.md](docs/PHILOSOPHY.md) – architecture philosophy
  - [core/toast/README.md](packages/nextjs-pandacss-ark/core/toast/README.md) – centralized toast
