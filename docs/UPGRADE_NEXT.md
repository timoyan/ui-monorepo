# Upgrade Plan: Next.js 15 → 16

This document outlines the upgrade path for **Next.js** (15.x → 16.x) in `packages/nextjs-pandacss-ark`.

---

## 1. Current State

| Item | Current |
|------|---------|
| Next.js | ^15.5.7 (package.json) |
| React / React-DOM | ^19.0.0 |
| Node (engines) | >=22.0.0 <23.0.0 |
| Router | **Pages Router** only (`pages/`: `_app`, `_document`, `index`, `api/msw/worker`) |
| Middleware | None (no `middleware.ts` / `proxy.ts`) |
| next.config.js | `output: "standalone"`, `reactStrictMode`, `async headers()` only; no custom webpack, no `experimental.turbopack` |

### Impact summary

- **Low risk**: No App Router, no middleware, no PPR, no unstable cache APIs, no `next/image` with query strings in code.
- **Turbopack**: v16 uses Turbopack by default for `next dev` and `next build`. Current scripts do not pass `--turbopack`; after upgrade they will use Turbopack automatically. No script change required unless you need to opt out (e.g. `next build --webpack`).

---

## 2. Why Upgrade to Next.js 16

- **Turbopack stable by default**: Faster dev (5–10x Fast Refresh) and builds (2–5x); no need for `--turbopack` flag.
- **Node / TS / browser support**: Node 20.9+, TypeScript 5.1+, modern browsers (see table below).
- **React 19.2**: View Transitions, `useEffectEvent()`, React Compiler support (stable in Next.js 16; opt-in via `reactCompiler: true`).
- **Caching**: New/stable APIs such as `updateTag`, `revalidateTag(tag, cacheLife)`, `refresh()`; `cacheLife` / `cacheTag` no longer `unstable_` (relevant if you adopt App Router or Server Components later).
- **Routing**: Incremental prefetching and layout deduplication; no code changes required.

### Node.js and browser requirements (v16)

| Requirement | Minimum |
|-------------|---------|
| Node.js | 20.9+ (Node 18 no longer supported) |
| TypeScript | 5.1.0+ |
| Browsers | Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+ |

Current `engines` (Node >=22.0.0) already satisfies Node 20.9+.

---

## 3. Breaking / Notable Changes (and applicability here)

### 3.1 Applicable

| Change | Impact in this repo |
|--------|----------------------|
| **Turbopack by default** | `next dev` and `next build` will use Turbopack. No custom webpack in this project → no change needed. If a dependency injects webpack config and build fails, use `next build --webpack` to opt out. |
| **`experimental.turbopack` → top-level `turbopack`** | Not used in current `next.config.js`; no action. |
| **React 19.2** | Already on React 19; upgrade to latest 19.x for full compatibility. |

### 3.2 Not applicable (Pages Router, no middleware)

- **Async Request APIs** (`params`, `searchParams`, `headers()`, `cookies()`, `draftMode`): App Router / Route Handlers only; no impact on current Pages Router setup.
- **middleware → proxy**: No `middleware.ts` in the project; no migration.
- **PPR / experimental_ppr**: Not used; no action. If you enable PPR later, v16 uses `cacheComponents: true` instead of `experimental.ppr`.
- **`revalidateTag` / `updateTag` / `cacheLife` / `cacheTag`**: Only relevant when using App Router / Server Components; no current usage.

### 3.3 Optional to be aware of

- **`next/image`**: If you later use local images with query strings (e.g. `/assets/photo?v=1`), you must add `images.localPatterns.search` to avoid enumeration. Not needed for current code.
- **`images.minimumCacheTTL`**: Default changed from 60s to 4h; only matters if you rely on the old default.
- **React Compiler**: Stable in v16; enable with `reactCompiler: true` and `babel-plugin-react-compiler` if desired (optional).

---

## 4. Suggested Upgrade Steps

### 4.1 Option A – Codemod (recommended)

From repo root:

```bash
pnpm dlx @next/codemod@canary upgrade latest
```

The codemod can:

- Remove `experimental_ppr` and update route segment configs (none in this repo).
- Remove `unstable_` prefix from cache APIs (none in use).
- Migrate middleware → proxy (no middleware).
- Update `next.config.js` for Turbopack if needed.

Then install and verify:

```bash
pnpm install
pnpm --filter nextjs-pandacss-ark run type-check
pnpm --filter nextjs-pandacss-ark run build
pnpm --filter nextjs-pandacss-ark run test:run
```

### 4.2 Option B – Manual version bump

1. **Bump versions** in `packages/nextjs-pandacss-ark/package.json`:
   - `"next": "^15.5.7"` → `"next": "^16.0.0"` (or `"next": "latest"` to pin after testing).
   - Optional: `"react": "^19.0.0"` and `"react-dom": "^19.0.0"` → latest 19.x (e.g. `^19.2.0` if available).
   - Optional: ensure `@types/react` and `@types/react-dom` are up to date.
2. **Install**: From repo root, `pnpm install`.
3. **Verify**: Same as above (type-check, build, test).
4. **Dev smoke test**: `pnpm --filter nextjs-pandacss-ark run dev` and check app and MSW worker.

### 4.3 If build fails (e.g. webpack-related)

- If the failure is due to a plugin or dependency adding webpack config, use Webpack for build only:
  - In `packages/nextjs-pandacss-ark/package.json`:
    - `"build": "panda codegen && next build --webpack"`
- Prefer fixing or migrating to Turbopack-compatible setup when possible.

---

## 5. Order Relative to Ark UI / Panda Upgrades

If you are also upgrading **@ark-ui/react** and **@pandacss/dev** (see [UPGRADE_ARK_PANDA.md](./UPGRADE_ARK_PANDA.md)):

- **Recommended**: Upgrade **Next.js first** (or after Panda), then do Ark UI. This keeps framework and bundler (Turbopack) stable before touching component APIs and tests.
- **Alternative**: Upgrade Next.js and Panda in one PR, then Ark in a second; or do all three in one pass if you prefer a single change set (harder to bisect if something breaks).

---

## 6. Checklist (copy and use)

- [ ] Branch / backup before starting.
- [ ] Run codemod: `pnpm dlx @next/codemod@canary upgrade latest` (or bump `next` manually).
- [ ] `pnpm install`.
- [ ] `pnpm --filter nextjs-pandacss-ark run type-check`.
- [ ] `pnpm --filter nextjs-pandacss-ark run build`.
- [ ] `pnpm --filter nextjs-pandacss-ark run test:run`.
- [ ] Manual: `pnpm --filter nextjs-pandacss-ark run dev` — check home, MSW, and any critical flows.
- [ ] If needed: add `next build --webpack` to `package.json` build script and document reason.
- [ ] Commit (e.g. `chore(nextjs-pandacss-ark): upgrade Next.js to 16`).

---

## 7. References

- [Next.js 16 – Upgrading (official)](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16 blog](https://nextjs.org/blog/next-16)
- [Upgrade codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#160)
- Project: [UPGRADE_ARK_PANDA.md](./UPGRADE_ARK_PANDA.md), [AGENTS.md](../AGENTS.md)
