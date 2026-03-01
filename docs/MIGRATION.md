# Migration Guide: Transplanting to Another Repo

This document describes how to move this project (slim monorepo with **nextjs-pandacss-ark** only) to a new repository. Use it when you want to clone/copy the app and tooling into a different repo while keeping structure and conventions.

---

## 1. What This Repo Is

- **Structure**: pnpm workspace with a single package: `packages/nextjs-pandacss-ark` (Next.js 16 + PandaCSS + Ark UI).
- **Tooling**: Biome (lint/format), Husky + lint-staged, Conventional Commits. Optional: VS Code + Gemini (`.gemini/instructions.md`), Cursor rules (`.cursor/`, `.agent/`).

---

## 2. What to Copy (Keep)

### 2.1 Root – Required

| Item | Purpose |
|------|--------|
| `package.json` | Root scripts, devDependencies, pnpm overrides, lint-staged. |
| `pnpm-workspace.yaml` | Defines `packages/*`. |
| `biome.json` | Lint and format config. |
| `.gitignore` | Ignore patterns (build, coverage, env, etc.). |
| `.husky/` | Pre-commit (lint-staged) and pre-push (build). |
| `AGENTS.md` | Canonical AI/agent rules (single source of truth). |
| `scripts/verify-overrides.js` | Optional; verifies pnpm overrides if you keep overrides. |

### 2.2 Root – Docs (Optional but Recommended)

| Item | Purpose |
|------|--------|
| `README.md` | Update for the new repo name and context. |
| `DEPENDENCY_UPDATE_POLICY.md` | Lockfile and upgrade policy. |
| `MIGRATION.md` | This file; keep for future moves or remove. |
| `PNPM_OVERRIDES_GUIDE.md` | Only if you use pnpm overrides. |

### 2.3 Root – Editor / AI (Optional)

| Item | Purpose |
|------|--------|
| `.gemini/instructions.md` | VS Code + Gemini Code Assist; points to AGENTS.md. |
| `.cursor/` | Cursor MCP/docs; keep if you use Cursor. |
| `.agent/rules/` | Antigravity/agent rules; keep if you use them. |
| `.vscode/settings.json` | Format on save, Biome as default formatter. |
| `.vscode/extensions.json` | Workspace extension recommendations (can be empty). |

### 2.4 App Package – Full Copy

Copy the **entire** `packages/nextjs-pandacss-ark/` directory. It is self-contained: app code, tests, mocks, PandaCSS/Ark UI, Next config, Dockerfile, and package-specific docs.

Important sub-paths:

- `pages/`, `components/`, `features/`, `modules/`, `core/`, `apis/`, `hooks/`, `mocks/`, `test/`
- `next.config.js`, `panda.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `vitest.config.ts`
- `UNIT_TESTING.md`, `ARCHITECTURE.md`, `ONBOARDING.md`, `DOCKER.md`, `README.md`, `.env.example`, `.dockerignore`, `biome.json`

Do **not** copy from the old repo:

- `node_modules/`, `.next/`, `build/`, `dist/`, `coverage/`, `styled-system/`
- Any `packages/` other than `nextjs-pandacss-ark` (e.g. no ui-react18, module-library, etc.)

---

## 3. What to Do After Copying

### 3.1 Repo and Package Names

- **Root `package.json`**: Change `"name"` (e.g. from `"ui-monorepo"` to your new repo name).
- **App package**: In `packages/nextjs-pandacss-ark/package.json`, change `"name"` if you want a different package name (e.g. `"my-app"`). If you rename the package, also rename the folder `packages/nextjs-pandacss-ark` → `packages/<new-name>` and update:
  - Root `package.json` scripts: `--filter nextjs-pandacss-ark` → `--filter <new-name>`.
  - Any docs that reference the package path (README, AGENTS.md, etc.).

### 3.2 Git

- In the **new repo**: `git init` (or clone the target repo), then add and commit the copied files.
- Remove the old remote and add the new one:  
  `git remote remove origin` (if present), then `git remote add origin <new-repo-url>`.
- Optionally keep or drop Git history when copying (e.g. copy files only vs. subtree/filter-branch).

### 3.3 Environment and Secrets

- Copy `packages/nextjs-pandacss-ark/.env.example` as a template only; do **not** commit real secrets.
- In the new repo, create `.env.local` (or CI secrets) from the example and fill in values. Add `.env.local` to `.gitignore` (already there).
- If the app uses API base URLs or feature flags, update them for the new environment.

### 3.4 Lockfile and Install

- Do **not** copy `pnpm-lock.yaml` from the old repo if the new repo has a different OS or Node version and you want a clean lockfile. Otherwise, copying it is fine.
- In the new repo root run:
  ```bash
  pnpm install
  ```
- Run tests: `pnpm test`. Fix any path or config issues (e.g. `@/` aliases, env vars).

### 3.5 Docs and Links

- Update **README.md** (repo name, clone URL, “how to run”, links to AGENTS.md / UNIT_TESTING.md).
- In **AGENTS.md**, if you renamed the package, replace `packages/nextjs-pandacss-ark` with `packages/<new-name>` in the Testing section and in the path to `UNIT_TESTING.md`.
- In **.gemini/instructions.md**, adjust the “Quick summary” if the package path or rules changed.
- Search the repo for the old repo URL or old package name and replace with the new one.

---

## 4. What You Can Omit or Add

### 4.1 Safe to Omit

- **scripts/verify-overrides.js** – Only needed if you rely on pnpm overrides and want to verify them.
- **.cursor/**, **.agent/** – Omit if you do not use Cursor or Antigravity.
- **.gemini/** – Omit if you do not use VS Code + Gemini Code Assist.
- **DEPENDENCY_UPDATE_POLICY.md**, **PNPM_OVERRIDES_GUIDE.md** – Omit if you do not need those policies.

### 4.2 Optional Additions in the New Repo

- **.github/workflows/** – Add CI (e.g. build, unit tests) if the new repo uses GitHub Actions.
- **E2E** – If you later add Playwright (or similar), add the config and scripts back; this repo is currently E2E-free by design.
- **License file** – Add LICENSE if the new repo is open source or needs one.

---

## 5. Checklist After Migration

- [ ] Root: `package.json` name and scripts (filter name) updated.
- [ ] App: `packages/<app>/package.json` name and any internal references updated.
- [ ] Git remote and branch set for the new repo.
- [ ] `.env.example` present; `.env.local` created locally (and in CI if needed); no secrets committed.
- [ ] `pnpm install` runs without errors.
- [ ] `pnpm test` passes.
- [ ] `pnpm --filter <app> dev` (or your dev script) runs.
- [ ] README and AGENTS.md (and .gemini if used) mention the correct package path and repo.
- [ ] Pre-commit: change a file and commit; confirm `lint-staged` runs (Biome format/lint).

---

## 6. Alternative: Single-Package Repo (No Monorepo)

If you want the app at the **repository root** (no `packages/`):

1. Move everything under `packages/nextjs-pandacss-ark/` to the repo root (e.g. `pages/`, `components/`, `next.config.js`, etc.).
2. Merge root and app `package.json`: combine scripts and devDependencies; keep the app’s dependencies and name.
3. Remove `pnpm-workspace.yaml` (or keep and add `packages: []` if you might add packages later).
4. Merge or replace root `biome.json` with the app’s; update `extends` if the app had `"extends":"//"`.
5. Update all paths in docs (AGENTS.md, README, .gemini) from `packages/nextjs-pandacss-ark` to “this repo” or “root”.
6. Root test script: use `vitest run` (or your test command) directly instead of `pnpm --filter ...`.
7. Run `pnpm install`, `pnpm test`, and `pnpm dev` from the root and fix any remaining path references.

This gives you a single-package repo with the same app and similar tooling, without a workspace.
