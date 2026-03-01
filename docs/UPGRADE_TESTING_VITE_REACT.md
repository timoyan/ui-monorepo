# Upgrade: @testing-library/react & @vitejs/plugin-react

**Status:** Completed. RTL ^16.3.0 and plugin-react ^5.1.4 are in use; tests and type-check pass.

Planning document for upgrading `@testing-library/react` and `@vitejs/plugin-react` in `packages/nextjs-pandacss-ark`.

---

## Current versions

| Package | Before | After (upgraded) |
|--------|--------|-------------------|
| `@testing-library/react` | ^14.1.2 | ^16.3.0 |
| `@testing-library/dom` | (transitive 9.x) | ^10.4.0 (added for RTL 16 peer) |
| `@vitejs/plugin-react` | ^4.2.1 | ^5.1.4 |

**Location:** `packages/nextjs-pandacss-ark/package.json` (devDependencies)

**Usage:**
- **@vitejs/plugin-react**: `vitest.config.ts` — `plugins: [react()]` for JSX/React in Vitest.
- **@testing-library/react**: All `__tests__/*.test.tsx` and `test/renderWithRedux.tsx` — `render`, `screen`, `waitFor`, `renderHook`, `act`, etc.

---

## 1. @testing-library/react (14 → 16)

### 1.1 Version path

- **v15.0.0** (Apr 2024): Breaking changes (Node 18+, DOM role changes).
- **v16.x** (e.g. v16.3.x): Current stable; adds React error handler support and fixes.

Recommendation: upgrade in one step to **^16.3.0** (or latest 16.x). v15 is a required stepping stone; skipping to v16 avoids doing two passes.

### 1.2 Breaking / notable changes

| Change | Impact |
|--------|--------|
| **Node.js** | v15+ requires Node 18+. This repo uses `engines: ">=22.0.0 <23.0.0"` — OK. |
| **@testing-library/dom** | New version updates **role** definitions. Queries like `getByRole("button", { name: /.../i })` may behave differently; some roles/names might need adjustment. |
| **React error handlers** | v16 adds support for React error handlers; no mandatory test changes. |

### 1.3 What to do in this repo

1. **Bump version** in `packages/nextjs-pandacss-ark/package.json`:
   - `"@testing-library/react": "^14.1.2"` → `"@testing-library/react": "^16.3.0"` (or `^16.0.0`).
2. **Install:** from repo root, `pnpm install` (or from package dir, `pnpm install`).
3. **Run tests:** `pnpm --filter nextjs-pandacss-ark run test:run` (or `pnpm test` from root).
4. **Fix failing tests:** Focus on:
   - `getByRole` / `getByLabelText` / `queryByRole` — adjust role or name if DOM/accessibility output changed.
   - Any deprecation warnings in the test output (e.g. from `@testing-library/dom`).
5. **Optional:** Skim [React Testing Library – API](https://testing-library.com/docs/react-testing-library/api/) and [Releases](https://github.com/testing-library/react-testing-library/releases) for v15/v16 if you hit odd failures.

### 1.4 Risk and rollback

- **Risk:** Low–medium. Most breakage is from role/query behavior; our tests use explicit assertions (no snapshots), so fixes are localized.
- **Rollback:** Revert the version in `package.json` to `^14.1.2` and run `pnpm install` + tests again.

---

## 2. @vitejs/plugin-react (4 → 5)

### 2.1 Version

- **v5.1.4** (Feb 2025): Current stable. Use **^5.1.0** or **^5.1.4**.

### 2.2 Breaking / notable changes

| Change | Impact |
|--------|--------|
| **Node.js** | v5 requires **Node 20.19+** or **22.12+**. Repo uses Node 22 — ensure runtime is **≥ 22.12** (e.g. CI and local). |
| **Return type** | Plugin return type changed from `PluginOption[]` to `Plugin[]`. Only affects TypeScript if you type the plugin array strictly; `defineConfig` usually accepts both. |
| **Fast Refresh (HMR)** | v5 is stricter: files that export both React components and non-component utilities can trigger HMR invalidation in **dev**. No impact on **Vitest** (we only use the plugin in `vitest.config.ts` for tests). |

### 2.3 What to do in this repo

1. **Check Node version:**  
   - In CI and locally, use Node **≥ 22.12** (or ≥ 20.19 if you prefer).  
   - Example: `.nvmrc` or CI matrix with `node: '22.12'` or `node: '22'` (and confirm 22.12+ is used).

2. **Bump version** in `packages/nextjs-pandacss-ark/package.json`:
   - `"@vitejs/plugin-react": "^4.2.1"` → `"@vitejs/plugin-react": "^5.1.4"`.

3. **Install:** `pnpm install`.

4. **Config:** `vitest.config.ts` already uses `import react from "@vitejs/plugin-react"` and `plugins: [react()]`. No config change required for basic use. If you see a type error on `plugins`, you can type as `Plugin[]` or leave as-is if `defineConfig` infers correctly.

5. **Run tests:** `pnpm --filter nextjs-pandacss-ark run test:run` to ensure Vitest still runs with the new plugin.

6. **Optional (dev):** If you use Vite dev server elsewhere with this plugin, test HMR; avoid mixing component and utility exports in the same file if you see noisy invalidation.

### 2.4 Risk and rollback

- **Risk:** Low. Plugin is only used for Vitest; no HMR in test runs.
- **Rollback:** Revert to `"@vitejs/plugin-react": "^4.2.1"` and `pnpm install`.

---

## 3. Recommended order and checklist

Do both upgrades in one PR, or split into two.

### Option A: Single PR (recommended)

1. [ ] Ensure Node ≥ 22.12 (or ≥ 20.19) in CI and local.
2. [ ] In `packages/nextjs-pandacss-ark/package.json`:
   - `@testing-library/react`: `^14.1.2` → `^16.3.0`
   - `@vitejs/plugin-react`: `^4.2.1` → `^5.1.4`
3. [ ] Run `pnpm install` from repo root.
4. [ ] Run `pnpm --filter nextjs-pandacss-ark run test:run` (or `pnpm test`).
5. [ ] Fix any failing tests (mainly role/query updates for RTL).
6. [ ] Run `pnpm run type-check` and fix any plugin typings if needed.
7. [ ] Commit with a message like: `chore(deps): upgrade @testing-library/react to ^16 and @vitejs/plugin-react to ^5`.

### Option B: Two PRs

1. **PR 1 – @vitejs/plugin-react only**  
   Bump to ^5.1.4, ensure Node, run tests. Low risk.

2. **PR 2 – @testing-library/react only**  
   Bump to ^16.3.0, run tests, fix role/query breakages.

---

## 4. Files to touch

| File | Change |
|------|--------|
| `packages/nextjs-pandacss-ark/package.json` | Version bumps for both packages. |
| `packages/nextjs-pandacss-ark/vitest.config.ts` | No change expected; optional type tweak if TypeScript complains. |
| `packages/nextjs-pandacss-ark/test/renderWithRedux.tsx` | No change expected (uses standard `render`). |
| `packages/nextjs-pandacss-ark/**/__tests__/*.test.tsx` | Only if tests fail after RTL upgrade; adjust `getByRole` / `getByText` / etc. |

---

## 5. References

- [React Testing Library – Releases](https://github.com/testing-library/react-testing-library/releases) (v15.0.0, v16.x).
- [React Testing Library – API](https://testing-library.com/docs/react-testing-library/api/).
- [@vitejs/plugin-react – Releases](https://github.com/vitejs/vite-plugin-react/releases) (plugin-react@5.1.4).
- [@vitejs/plugin-react – npm](https://www.npmjs.com/package/@vitejs/plugin-react).
