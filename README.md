# UI Monorepo

This repository contains a UI app package managed as a pnpm workspace.

## Packages

- **`packages/nextjs-pandacss-ark`** – Next.js 15 app (Pages Router) with PandaCSS and Ark UI (`Button`, `Accordion`, etc.).
  - Package docs entrypoint: see `packages/nextjs-pandacss-ark/README.md` (`Docs` section).

Development is set up for **VS Code + Gemini Code Assistant**. Canonical project rules live in **AGENTS.md**; Gemini instructions in `.gemini/instructions.md` point to AGENTS.md.

## Tech Stack

- **Next.js 15** (Pages Router)
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

See `packages/nextjs-pandacss-ark/UNIT_TESTING.md` for testing conventions (Redux isolation, MSW, no snapshot tests).

## Linting & Formatting (Biome)

- **Lint**: `pnpm lint`
- **Format check**: `pnpm format`
- **Format write**: `pnpm format:write` or `pnpm format -- --write`

Biome is configured in `biome.json` at the repo root.

## Git Hooks (Husky + lint-staged)

- `prepare` installs Husky.
- Pre-commit runs `lint-staged`: format and lint staged files with Biome. Unfixable issues block the commit.

## Docs

- **Repo-level**
  - `AGENTS.md` – AI/code rules and commit conventions

- **`packages/nextjs-pandacss-ark`**
  - Architecture: `packages/nextjs-pandacss-ark/ARCHITECTURE.md`
  - Testing guide: `packages/nextjs-pandacss-ark/UNIT_TESTING.md`
  - Centralized toast: `packages/nextjs-pandacss-ark/core/toast/README.md`
