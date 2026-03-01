# Onboarding (repo root)

This repo is a **pnpm workspace** with one app package. All commands below are run from the **repository root** unless stated otherwise. Use this doc for first-time setup, daily workflow, and conventions.

---

## Prerequisites

- **Node.js** `>=22` (see `engines` in the app package: `packages/nextjs-pandacss-ark/package.json`)
- **pnpm** (workspace scripts assume pnpm)

```bash
node -v   # e.g. v22.x or v24.x
pnpm -v   # e.g. 9.x or 10.x
```

---

## Quick start (from repo root)

```bash
pnpm install
pnpm --filter nextjs-pandacss-ark run dev
```

Open [http://localhost:3000](http://localhost:3000). Run tests: `pnpm test:unit`.

---

## First-time setup

### 1. Install dependencies

From the repo root:

```bash
pnpm install
```

This installs dependencies for the whole workspace. Do not run install from inside a package; use the root.

### 2. Environment (optional)

The app reads env from `packages/nextjs-pandacss-ark/`. To override defaults (e.g. port):

- Copy `packages/nextjs-pandacss-ark/.env.example` to `packages/nextjs-pandacss-ark/.env.local`
- Do not commit `.env.local`

### 3. Run the dev server

```bash
pnpm --filter nextjs-pandacss-ark run dev
```

### 4. HTTPS / custom domain (optional)

For a custom hostname and MSW with trusted certs, see the app README: [packages/nextjs-pandacss-ark/README.md](../packages/nextjs-pandacss-ark/README.md) → “Custom domain and MSW” (mkcert + `dev:https:custom`). Run from root: `pnpm --filter nextjs-pandacss-ark run dev:https:custom`.

### 5. Verify tests

```bash
pnpm test:unit
```

All unit tests should pass. Testing policy and how to write tests: [UNIT_TESTING.md](UNIT_TESTING.md).

---

## Daily workflow (from repo root)

| Task | Command |
|------|---------|
| Lint | `pnpm lint` |
| Lint (fix) | `pnpm lint:fix` |
| Format (check) | `pnpm format` or `pnpm format:check` |
| Format (write) | `pnpm format:write` |
| Full check (lint + format) | `pnpm check` |
| Full check (fix) | `pnpm check:fix` |
| Type-check | `pnpm type-check` |
| Dev server (HTTP) | `pnpm --filter nextjs-pandacss-ark run dev` |
| Dev server (HTTPS) | `pnpm --filter nextjs-pandacss-ark run dev:https:custom` |
| Build app | `pnpm --filter nextjs-pandacss-ark run build` |
| Run built app | `pnpm --filter nextjs-pandacss-ark run start` (after build) |
| Unit tests (single run) | `pnpm test:unit` or `pnpm test` |
| Unit tests (watch) | `pnpm --filter nextjs-pandacss-ark run test` |
| Test report (HTML) | `pnpm --filter nextjs-pandacss-ark run test:report` then `pnpm --filter nextjs-pandacss-ark run test:report:view` |
| Test coverage | `pnpm --filter nextjs-pandacss-ark run test:coverage` |
| Test (Sonar) | `pnpm test:sonar` |
| Reinit MSW worker | `pnpm --filter nextjs-pandacss-ark run msw:init` (after MSW upgrade) |
| Verify pnpm overrides | `pnpm verify-overrides` |
| Clean reinstall | `pnpm clean-install` |

---

## Repo structure (root scope)

| Location | Purpose |
|----------|---------|
| **Repo root** | `package.json` (workspace scripts: lint, format, test, type-check), `pnpm-workspace.yaml`, `docs/`, `biome.json`, Husky + lint-staged |
| **docs/** | Repo-level docs: this file, [UNIT_TESTING.md](UNIT_TESTING.md), [PHILOSOPHY.md](PHILOSOPHY.md), CI, migration, pnpm overrides, dependency policy |
| **packages/nextjs-pandacss-ark/** | Next.js app (Pages Router). Key folders: `core/`, `pages/`, `modules/`, `features/`, `components/` (atomics, composed incl. layout, features; PandaCSS + Ark UI), `apis/`, `hooks/`, `mocks/` |

App structure details: [packages/nextjs-pandacss-ark/ARCHITECTURE.md](../packages/nextjs-pandacss-ark/ARCHITECTURE.md). Design rationale: [PHILOSOPHY.md](PHILOSOPHY.md).

---

## Tech stack

- **Repo**: pnpm workspaces, Biome (lint/format), Husky + lint-staged
- **App** (nextjs-pandacss-ark): Next.js (Pages Router), PandaCSS, Ark UI, Redux Toolkit / RTK Query
- **Testing**: Vitest, React Testing Library, MSW (see [UNIT_TESTING.md](UNIT_TESTING.md))

---

## Conventions

- **Comments and docs**: English. Canonical rules: [AGENTS.md](../AGENTS.md).
- **Tests**: No snapshot tests; explicit assertions only. See [UNIT_TESTING.md](UNIT_TESTING.md).
- **Commits**: English, [Conventional Commits](https://www.conventionalcommits.org/) — e.g. `feat(ui): add button`, `fix(api): handle 404`.

---

## Config (root scope)

| Path (from repo root) | Purpose |
|------------------------|--------|
| `package.json` | Workspace scripts, lint-staged, pnpm overrides |
| `pnpm-workspace.yaml` | Workspace package list |
| `biome.json` | Lint and format config |
| `packages/nextjs-pandacss-ark/package.json` | App scripts, dependencies, `engines` |
| `packages/nextjs-pandacss-ark/panda.config.ts` | PandaCSS theme |
| `packages/nextjs-pandacss-ark/vitest.config.ts` | Vitest, `@/` alias, setup file |
| `packages/nextjs-pandacss-ark/.env.example` | Env template (copy to `.env.local` in same dir) |

---

## Troubleshooting

| Issue | Fix (from repo root or path from root) |
|-------|----------------------------------------|
| Port in use | Set `PORT=3001` in `packages/nextjs-pandacss-ark/.env.local` |
| MSW / SSL in dev | App README → “Custom domain and MSW”: mkcert + `pnpm --filter nextjs-pandacss-ark run dev:https:custom` |
| Tests fail after MSW upgrade | `pnpm --filter nextjs-pandacss-ark run msw:init` |
| PandaCSS styles missing | Run `pnpm --filter nextjs-pandacss-ark run dev` or `run build` (they run `panda codegen`) |

---

## More docs (from repo root)

- [README.md](../README.md) — repo overview, getting started, Git hooks
- [AGENTS.md](../AGENTS.md) — code rules, commits, testing policy (canonical for AI tools)
- [docs/UNIT_TESTING.md](UNIT_TESTING.md) — how to run and write tests
- [docs/PHILOSOPHY.md](PHILOSOPHY.md) — architecture philosophy and boundaries
- [packages/nextjs-pandacss-ark/README.md](../packages/nextjs-pandacss-ark/README.md) — app details, custom domain, Docker
- Other docs in [docs/](.) — CI, migration, pnpm overrides, dependency policy
