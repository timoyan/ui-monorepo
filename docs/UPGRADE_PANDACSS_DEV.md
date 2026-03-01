# Upgrade Plan: @pandacss/dev

Upgrade path for **@pandacss/dev** in `packages/nextjs-pandacss-ark`.

---

## 1. Current State

| Item | Value |
|------|--------|
| **Package** | `@pandacss/dev` |
| **Current version** | `^0.53.0` (package.json) |
| **Latest 0.53.x** | 0.53.6 (patch) |
| **Latest 0.54.x** | 0.54.0 (minor, Jun 2025) |
| **Latest stable** | **1.8.2** (major, Feb 2026) |

### Usage in this repo

- **Config**: `panda.config.ts` — `defineConfig` from `@pandacss/dev`, `outdir: "styled-system"`.
- **Scripts**: `prepare` / `build` / `dev` — `panda codegen` and `panda codegen --watch`.
- **Imports**: `@/styled-system/jsx` (`styled()`), `@/styled-system/css` (`css()`).
- **Files**: Button, Dialog, Accordion, Input, Autocomplete, layout, pages, etc. (see grep `styled-system`).

---

## 2. Upgrade Options

### Option A – Patch: 0.53.0 → 0.53.6 (recommended first step)

- **Risk**: Low.
- **Scope**: Bug fixes and small improvements only.
- **Steps**:
  1. In `packages/nextjs-pandacss-ark/package.json`: `"@pandacss/dev": "^0.53.0"` → `"@pandacss/dev": "^0.53.6"`.
  2. From repo root: `pnpm install`.
  3. `pnpm --filter nextjs-pandacss-ark run prepare` (regenerate styled-system).
  4. `pnpm --filter nextjs-pandacss-ark run type-check` and `run build`.
  5. Run tests and quick visual check.

### Option B – Minor: 0.53 → 0.54

- **Risk**: Low–medium.
- **Notable in 0.54**: More `aria-*` conditions (`invalid`, `readOnly`, `disabled`, etc.) for accessibility; otherwise dependency bumps.
- **Steps**: Same as Option A, but set `"@pandacss/dev": "^0.54.0"`. If you hit type or config issues, check [Panda releases](https://github.com/chakra-ui/panda/releases) for 0.54.

### Option C – Major: 0.53 / 0.54 → 1.x (e.g. 1.8.2)

- **Risk**: Medium. Major version may introduce config or API changes.
- **1.0.0**: Stable release; adds `createStyleContext` in framework artifacts (optional). `defineConfig` and `outdir: "styled-system"` remain valid.
- **Suggested approach**:
  1. Complete Option A (and optionally B) first.
  2. Create a branch and bump to `"@pandacss/dev": "^1.8.2"` (or `^1.0.0"` for a conservative 1.x).
  3. `pnpm install` → `panda codegen` → type-check → build.
  4. If CLI or config errors appear, check [Panda CSS docs](https://panda-css.com/docs) and [GitHub releases](https://github.com/chakra-ui/panda/releases).
  5. Run full test suite and manual smoke test (Dialog, Accordion, Autocomplete, Toast, buttons, layout).

---

## 3. Suggested Order

1. **Do Option A** (0.53.6) and commit (e.g. `chore(nextjs-pandacss-ark): upgrade @pandacss/dev to ^0.53.6`).
2. **Optional**: Do Option B (0.54) in a follow-up commit.
3. **Optional**: Plan a separate task/PR for Option C (1.x) and test thoroughly.

---

## 4. Checklist (copy and use)

- [ ] Branch / backup.
- [ ] **Patch**: Bump `@pandacss/dev` to `^0.53.6` in `packages/nextjs-pandacss-ark/package.json`.
- [ ] `pnpm install` → `pnpm --filter nextjs-pandacss-ark run prepare` → type-check → build.
- [ ] Run tests: `pnpm --filter nextjs-pandacss-ark run test:run`.
- [ ] Quick visual check (dev server, key components).
- [ ] **Optional minor**: Bump to `^0.54.0`, repeat install/codegen/type-check/build/tests.
- [ ] **Optional major**: Bump to `^1.8.2` (or `^1.0.0`), repeat and fix any config/API breaks.
- [ ] Commit with Conventional Commits (e.g. `chore(nextjs-pandacss-ark): upgrade @pandacss/dev`).

---

## 5. Rollback

- Revert the version range in `package.json` and run `pnpm install`. No need to edit lockfile by hand if only the range is reverted.

---

## 6. References

- [Panda CSS docs](https://panda-css.com/docs)
- [Panda CSS config reference](https://panda-css.com/docs/references/config)
- [Panda GitHub releases](https://github.com/chakra-ui/panda/releases)
- [npm @pandacss/dev](https://www.npmjs.com/package/@pandacss/dev)
- Project: `docs/UPGRADE_ARK_PANDA.md`, `AGENTS.md`
