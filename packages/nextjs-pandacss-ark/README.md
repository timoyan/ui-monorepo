# nextjs-pandacss-ark

Next.js app with PandaCSS and Ark UI.

## Tech stack

- **Next.js** – React framework (Pages Router)
- **PandaCSS** – Build-time CSS-in-JS with zero runtime
- **Ark UI** – Headless, accessible UI components
- **Redux Toolkit (RTK Query)** – State management and data fetching

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- **`components/`** – Button, Accordion (PandaCSS + Ark UI)
- **`features/cart/`** – Cart feature (RTK Query)
- **`apis/`** – RTK Query API slice and endpoints
- **`store/`** – Redux store config
- **`mocks/`** – MSW handlers, fixtures, browser/server setup

## Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production
- `pnpm start` – Start production server
- `pnpm test` – Run tests in watch mode
- `pnpm test:run` – Run tests once (CI)

## Mock API (MSW)

MSW is enabled in development to mock API requests.

- **Handlers**: `mocks/handlers.ts` – Add or edit mock endpoints
- **Stores**: `mocks/stores/` – In-memory state for handlers (e.g. `cartStore.ts` for cart add/update/remove). Add one file per domain; reset between tests via `resetCartStore()` etc.
- **Fixtures**: `mocks/fixtures/` – Shared mock data (e.g. `defaultCartItem`, `createMockCartItem`) for handlers and tests
- **Config**: `mocks/config.ts` – `devOptions` (bypass) vs `testOptions` (error)
- **Browser**: `mocks/browser.ts` – Used in dev (via `useMSWReady` in `_app`)
- **Node**: `mocks/server.ts` – For unit tests (Vitest/Jest)

**Behavior**:

- **Local dev**: All APIs bypass (hit real network) by default. Only APIs with handlers in `handlers.ts` are mocked.
- **CI / Unit tests**: All API requests must be handled by MSW. Unhandled requests fail the test.

**Test setup**: Import `test/setup.ts` in your test config (e.g. `setupFiles`) so `server` runs before tests. In tests that hit cart endpoints, call `resetCartStore()` in `beforeEach` so cart state does not leak between tests.

**Regenerate service worker**: Run `pnpm msw:init` after upgrading MSW if the worker needs updating. The worker lives in `msw/` and is committed; `msw init` is not run during `pnpm install` to avoid install hangs.
