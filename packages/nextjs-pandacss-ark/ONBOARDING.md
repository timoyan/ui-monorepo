# Onboarding — nextjs-pandacss-ark

This guide helps you get started when this project is **cloned into another repository**. Use it for first-time setup, daily commands, and conventions.

---

## Prerequisites

- **Node.js** `>=22.0.0 <23.0.0` (see `engines` in `package.json`)
- **pnpm** (recommended; npm/yarn may work but scripts assume pnpm)

Check versions:

```bash
node -v   # e.g. v22.x.x
pnpm -v   # e.g. 9.x or 10.x
```

---

## First-time setup

### 1. Install dependencies

From the **project root** (where `package.json` lives):

```bash
pnpm install
```

If this app lives inside a **monorepo**, run `pnpm install` from the **monorepo root** so workspace dependencies resolve correctly.

### 2. Environment (optional)

- Copy `.env.example` to `.env.local` if you need to override defaults (e.g. `PORT=3001`).
- Do not commit `.env.local`. Use it for local dev only.

### 3. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. (Optional) HTTPS with a custom domain

If you use a custom hostname (e.g. `https://local.timotest.com`) and MSW, you need trusted certs. See **README.md** → “Custom domain (e.g. local.timotest.com) and MSW” for mkcert setup and `pnpm dev:https:custom`.

### 5. Verify tests

```bash
pnpm test:run
```

All unit tests should pass. If you are in a monorepo, you can run from repo root: `pnpm --filter nextjs-pandacss-ark run test:run` or use the repo’s `pnpm test:unit` if it includes this package.

---

## Daily workflow

| Task              | Command           | Notes                                      |
|-------------------|-------------------|--------------------------------------------|
| Dev server (HTTP) | `pnpm dev`        | Port 3000; no Turbopack (PandaCSS + Webpack) |
| Dev server (HTTPS)| `pnpm dev:https:custom` | Port 443; needs mkcert certs in `certs/` |
| Production build  | `pnpm build`      | Runs `panda codegen` then `next build`     |
| Production run    | `pnpm start`      | After `pnpm build`                         |
| Tests (watch)     | `pnpm test`       | Vitest watch mode                          |
| Tests (once)      | `pnpm test:run`   | Use in CI or before commit                 |
| Test report       | `pnpm test:report` then `pnpm test:report:view` | HTML report on port 3131   |
| Test coverage     | `pnpm test:coverage` | LCOV in `test-result/coverage/`          |
| Regenerate MSW worker | `pnpm msw:init` | After MSW upgrade if worker changes        |

---

## Project structure (summary)

- **`core/`** — App-level: store, router, error boundary
- **`pages/`** — Next.js pages (Pages Router)
- **`modules/`** — Domain modules that combine multiple features
- **`features/`** — Standalone features (e.g. cart)
- **`components/`** — Reusable UI (e.g. `ui/button`, `ui/accordion`, `layout/`)
- **`apis/`** — RTK Query API slices and endpoints
- **`hooks/`** — Shared hooks (e.g. `useMSWReady`)
- **`mocks/`** — MSW handlers, server, browser, fixtures

Details: **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## Tech stack

- **Next.js** (Pages Router)
- **PandaCSS** — build-time CSS (zero runtime)
- **Ark UI** — headless accessible components
- **Redux Toolkit / RTK Query** — state and API
- **Vitest** + **Testing Library** — unit tests
- **MSW** — API mocking in dev and tests

---

## Conventions

- **Comments and docs**: English (code comments, JSDoc, TODO/FIXME).
- **Tests**: No snapshot tests (`toMatchSnapshot` / `toMatchInlineSnapshot`). Use explicit assertions (e.g. `expect(...).toBe()`, DOM queries).
- **Git commits**: English, [Conventional Commits](https://www.conventionalcommits.org/) — e.g. `feat(cart): add quantity input`, `fix(api): handle 404`.

If your repo has an **AGENTS.md** (or similar), keep these conventions in sync there.

---

## Key config files

| File / folder        | Purpose                                      |
|----------------------|----------------------------------------------|
| `package.json`       | Scripts, dependencies, `engines`             |
| `panda.config.ts`    | PandaCSS theme and config                    |
| `vitest.config.ts`   | Vitest env (happy-dom), alias `@/`, setup    |
| `test/setup.ts`      | MSW server, jest-dom, TZ/locale for tests    |
| `mocks/handlers.ts`  | MSW handlers (dev vs test)                   |
| `mocks/server.ts`    | MSW Node server used by Vitest               |
| `.env.example`       | Example env vars (copy to `.env.local`)      |

---

## Cloning into another repo

When this project is copied into a new repo:

1. Run **First-time setup** above from this app’s directory (or monorepo root).
2. Adjust **env** and **API base URLs** (e.g. in `apis/` or env) for the new backend.
3. If the new repo has its own **AGENTS.md** / lint/format rules, add or align:
   - No snapshot tests; comments in English; Conventional Commits.
4. **CI**: Run `pnpm test:run` (or the monorepo’s `test:unit` that includes this app) and `pnpm build` on the main branch and PRs.

---

## Troubleshooting

- **Port in use**: Set `PORT=3001` in `.env.local` (or another port).
- **MSW / SSL in dev**: See README.md → “Custom domain and MSW” for mkcert and `dev:https:custom`.
- **Tests fail after MSW upgrade**: Run `pnpm msw:init`.
- **PandaCSS styles missing**: Ensure `pnpm build` or `pnpm dev` has run (they run `panda codegen`).

For more detail: **[README.md](./README.md)** and **[ARCHITECTURE.md](./ARCHITECTURE.md)**.
