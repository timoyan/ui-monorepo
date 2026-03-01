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

### Local development (Windows / macOS, team setup)

- **Default**: `pnpm dev` runs with **HTTP on port 3000**; no admin rights needed on Windows or macOS.
- **HTTPS (e.g. custom domain on port 443)**: Use mkcert certs and run `pnpm dev:https:custom`; see “Custom domain and MSW” below.
- **Clean commands**: Scripts use `rimraf` instead of `rm -rf`, so they work in Windows CMD/PowerShell as well.
- **Custom port**: Create `.env.local` and set `PORT=3001` (must be loaded before start).

### Custom domain (e.g. local.timotest.com) and MSW

If you use a custom hostname with HTTPS (e.g. `https://local.timotest.com`), the browser must **trust the certificate** for that hostname. Otherwise you get:

- **"[MSW] Failed to register the Service Worker: An SSL certificate error occurred when fetching the script."**

Use **mkcert** to issue a trusted cert for your domain and run the dev server with that cert (no auto-generated certs).

1. **Install mkcert** (one-time; supports Windows and macOS):
   - macOS: `brew install mkcert && mkcert -install`
   - Windows: `choco install mkcert`, or `scoop install mkcert`, or `winget install mkcert`; then run `mkcert -install`
   - More options: [mkcert](https://github.com/FiloSottile/mkcert)

2. **Map the domain to localhost** (if not already):
   - Add a line to hosts: `127.0.0.1 local.timotest.com`  
   - macOS/Linux: `/etc/hosts`; Windows: `C:\Windows\System32\drivers\etc\hosts`

3. **Generate certs** in this package (e.g. in a `certs/` folder, and add `certs/` to `.gitignore`):
   ```bash
   mkdir -p certs
   mkcert -key-file certs/local.timotest.com-key.pem -cert-file certs/local.timotest.com.pem local.timotest.com
   ```

4. **Run the dev server with your cert** (port 443 needs admin/sudo on macOS, Administrator on Windows):
   ```bash
   pnpm dev:https:custom
   ```
   Or manually:
   ```bash
   next dev --experimental-https -p 443 \
     --experimental-https-key ./certs/local.timotest.com-key.pem \
     --experimental-https-cert ./certs/local.timotest.com.pem
   ```
   Then open **https://local.timotest.com** (no port in URL). The browser will trust the site and MSW can register.

To use a different domain or path, set env vars before running:

- `SSL_KEY_FILE` – path to the private key (e.g. `./certs/local.timotest.com-key.pem`)
- `SSL_CERT_FILE` – path to the certificate (e.g. `./certs/local.timotest.com.pem`)

## Project structure

- **`core/`** – App-level concerns (store, router, error handling)
- **`pages/`** – Next.js pages (combine modules/features/components)
- **`modules/`** – Business domain modules (combine multi features)
- **`features/`** – Independent features (cart, payment, etc.)
- **`components/`** – Reusable UI components (Button, Accordion)
- **`apis/`** – RTK Query API slices and endpoints
- **`hooks/`** – Shared hooks
- **`mocks/`** – MSW handlers, fixtures, browser/server setup

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Docs

- **Architecture**: 資料夾結構與分層規則，見 [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- **Unit Testing**: 測試技術棧與規範（Redux、MSW、斷言），見 [`UNIT_TESTING.md`](./UNIT_TESTING.md)
- **Centralized Toast**: 全域 toast 系統設計與使用方式，見 [`core/toast/README.md`](./core/toast/README.md)

## Scripts

- `pnpm dev` – Start development server (HTTP, port 3000). Next.js 16+ uses Turbopack by default; PandaCSS works with it.
- `pnpm dev:https:custom` – HTTPS on port 443 with mkcert certs for a custom domain (e.g. https://local.timotest.com). Requires certs in `certs/`; see “Custom domain and MSW” above.
- `pnpm build` – Run `panda codegen` then build for production
- `pnpm start` – Start production server
- `pnpm test` – Run tests in watch mode
- `pnpm test:run` – Run tests once (CI)
- `pnpm test:report` – Run tests and write HTML report to `test-result/`
- `pnpm test:report:view` – Serve `test-result/` on http://localhost:3131 and open in browser (use after `test:report`; required because the report cannot be opened via `file://` due to CORS)
- `pnpm test:coverage` – Run tests with coverage and write **lcov** report to `test-result/coverage/lcov.info` (and HTML to `test-result/coverage/lcov-report/`)

## Mock API (MSW)

MSW is enabled in development to mock API requests.

- **Handlers**: `mocks/handlers.ts` – Exports `devHandlers` (cart API) for **local dev only** and empty `handlers` for the test server. Add or edit endpoints in `devHandlers` to mock more APIs in dev.
- **Stores**: `mocks/local-dev-store/` – In-memory state used by `devHandlers` in local dev (e.g. `cartStore.ts` for cart add/update/remove). Not used by unit tests.
- **Config**: `mocks/config.ts` – `devOptions` (bypass) vs `testOptions` (error)
- **Browser**: `mocks/browser.ts` – Uses `devHandlers`; started in dev via `useMSWReady` in `_app`
- **Node**: `mocks/server.ts` – Uses empty `handlers`; for unit tests (Vitest). Each test mocks endpoints via `server.use()`.

**Behavior**:

- **Local dev**: The browser worker uses `devHandlers`. All other APIs bypass (hit real network). Only APIs in `devHandlers` are mocked.
- **Unit tests**: The test server starts with no handlers. Every test that hits an API must call `server.use()` in that test to mock the endpoints it needs. Unhandled requests fail the test.

**Test setup**: Import `test/setup.ts` in your test config (e.g. `setupFiles`) so the MSW server runs before tests. In tests that use RTK Query, call `store.dispatch(apiSlice.util.resetApiState())` in `beforeEach` to clear cache between tests. Mock cart (and other) endpoints in each test with `server.use(http.get(...), http.post(...), ...)`.

**Regenerate service worker**: Run `pnpm msw:init` after upgrading MSW if the worker needs updating. The worker lives in `msw/` and is committed; `msw init` is not run during `pnpm install` to avoid install hangs.
