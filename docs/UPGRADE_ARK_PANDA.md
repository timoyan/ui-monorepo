# Upgrade Plan: @ark-ui/react & @pandacss/dev

This document outlines the upgrade path for **@ark-ui/react** (3.x → 5.x) and **@pandacss/dev** (0.52 → 0.53+) in `packages/nextjs-pandacss-ark`.

---

## 1. Current State

| Package           | Current (package.json) | Resolved (pnpm-lock) |
|-------------------|------------------------|----------------------|
| @ark-ui/react     | ^3.2.0                 | 3.13.0               |
| @pandacss/dev     | ^0.52.0                | 0.52.0               |

### Ark UI usage in this repo

- **Accordion** – `components/atomics/accordion/index.tsx`
- **Combobox** – `components/composed/autocomplete/AutocompleteInput.tsx`
- **Dialog** – `components/atomics/dialog/index.tsx`
- **Portal** – `@ark-ui/react/portal` (with Dialog)
- **Toast** – `core/toast/createToaster.ts`, `core/toast/Toaster.tsx`

No **Carousel** or **TimePicker** usage (no impact from their breaking changes).

### Panda CSS usage

- `panda.config.ts` – `defineConfig` from `@pandacss/dev`
- `prepare` / `build` / `dev` – `panda codegen` and watch
- Styled components via `@/styled-system/jsx` (`styled()`)

### pnpm overrides (root)

- `@zag-js/core`: `>=0.82.2 <1.0.0` (Ark depends on Zag.js; may need review after Ark upgrade)

---

## 2. @ark-ui/react: 3.x → 5.x

### 2.1 Why upgrade

- **v5.0.0** (2025-03-06): Switched to React’s native reactive primitives; smaller bundle and better performance (e.g. 1.5x–4x in stress tests).
- **v5.x**: Many fixes (Toast, Combobox, Dialog, Dismissable, etc.) and new features (e.g. Combobox `defaultHighlightedValue` / `defaultInputValue`, Toast types, createContext/mergeProps).

### 2.2 Breaking / notable changes (v5.0.0 and later)

1. **Tests**
   - Components may render asynchronously. Prefer `findBy*` over `getBy*` when asserting on open state:
     ```ts
     // Before
     expect(screen.getByRole('dialog')).toBeInTheDocument()
     // After
     expect(await screen.findByRole('dialog')).toBeInTheDocument()
     ```
2. **Carousel** – Not used here. If you add it later: `Carousel.Root` now requires a `slideCount` prop.
3. **TimePicker** – Removed in 5.24.0 (experimental). Not used here.
4. **Hover Card / Tooltip** – Default delay values changed (5.24.0). Only relevant if you add these components.

### 2.3 Suggested upgrade steps (Ark)

1. **Bump version**
   - In `packages/nextjs-pandacss-ark/package.json`:
     - `"@ark-ui/react": "^3.2.0"` → `"@ark-ui/react": "^5.34.0"` (or latest 5.x).
2. **Reinstall**
   - From repo root: `pnpm install` (or `pnpm run clean-install` if you use overrides).
3. **Type-check and build**
   - `pnpm --filter nextjs-pandacss-ark run type-check`
   - `pnpm --filter nextjs-pandacss-ark run build`
4. **Tests**
   - Run: `pnpm --filter nextjs-pandacss-ark run test:run`
   - If Dialog/Accordion/Combobox/Toast tests flake or fail on “element not found”, switch to async queries:
     - `getByRole` → `findByRole` and `await` in the test.
5. **Manual check**
   - Smoke-test: Accordion, Autocomplete (combobox), Dialog, Toast (create/dismiss).
6. **@zag-js/core override (root package.json)**
   - Ark v5 requires @zag-js/* 1.x, which depends on @zag-js/core 1.x. Remove the root override `"@zag-js/core": ">=0.82.2 <1.0.0"` so the lockfile resolves to the version required by Ark (otherwise tests fail with "does not provide an export named 'setup'" / "INIT_STATE"). After removal, run `pnpm run clean-install`.

---

## 3. @pandacss/dev: 0.52 → 0.53+

### 3.1 Why upgrade

- **0.53.0**: New CSS property support (e.g. `fieldSizing`, `interpolateSize`, `textWrapMode`, `textSpacingTrim`, experimental anchor positioning).
- **0.53.1–0.53.6**: Fixes for file watching (chokidar), esbuild, style composition, and CSS generation.

### 3.2 Breaking / notable changes

- No major breaking changes identified for typical `defineConfig` + `styled()` + `panda codegen` usage.
- New tokens/utilities are additive; existing config and components should keep working.

### 3.3 Suggested upgrade steps (Panda)

1. **Bump version**
   - In `packages/nextjs-pandacss-ark/package.json`:
     - `"@pandacss/dev": "^0.52.0"` → `"@pandacss/dev": "^0.53.0"` (or `^0.53.6` for latest patch).
2. **Reinstall**
   - From repo root: `pnpm install`.
3. **Regenerate styles**
   - `pnpm --filter nextjs-pandacss-ark run prepare` (runs `panda codegen`).
4. **Build and type-check**
   - `pnpm --filter nextjs-pandacss-ark run type-check`
   - `pnpm --filter nextjs-pandacss-ark run build`
5. **Visual check**
   - Run dev and confirm layout/styles (especially Dialog, Accordion, Autocomplete, Toast).

---

## 4. Recommended order and rollback

### Option A – Conservative (recommended)

1. Upgrade **@pandacss/dev** to **^0.53.0** first (lower risk).
2. Run full test suite and manual smoke test.
3. Then upgrade **@ark-ui/react** to **^5.34.0** (or latest 5.x).
4. Fix any test assertions (async queries) and re-run tests + manual checks.
5. Commit: one for Panda, one for Ark (or one combined chore if you prefer).

### Option B – Both at once

- Bump both in `packages/nextjs-pandacss-ark/package.json`, run `pnpm install`, then run type-check, build, tests, and manual checks. Easier to do in one PR but harder to bisect if something breaks.

### Rollback

- Revert the version ranges in `package.json` and run `pnpm install` (or `pnpm run clean-install` if overrides changed). No lockfile edits needed if you only change version ranges and reinstall.

---

## 5. Checklist (copy and use)

- [ ] Backup / branch before starting.
- [ ] **Panda:** Bump `@pandacss/dev` to `^0.53.0` (or `^0.53.6`).
- [ ] **Panda:** `pnpm install` → `panda codegen` → type-check → build → manual check.
- [ ] **Ark:** Bump `@ark-ui/react` to `^5.34.0` (or latest 5.x).
- [ ] **Ark:** `pnpm install` → type-check → build.
- [ ] **Ark:** Run tests; fix any Dialog/Accordion/Combobox/Toast tests with async `findBy*`.
- [ ] **Ark:** Manual smoke test (Accordion, Autocomplete, Dialog, Toast).
- [ ] **Optional:** Run `pnpm why @zag-js/core` and adjust root overrides if needed.
- [ ] Commit (e.g. `chore(nextjs-pandacss-ark): upgrade @pandacss/dev and @ark-ui/react`).

---

## 6. References

- [Ark UI Changelog](https://ark-ui.com/react/docs/overview/changelog)
- [Panda CSS Changelog](https://github.com/chakra-ui/panda/blob/main/CHANGELOG.md) (check latest tags/releases for 0.53.x)
- Project: `AGENTS.md`, `docs/PNPM_OVERRIDES_GUIDE.md`, `packages/nextjs-pandacss-ark/UNIT_TESTING.md`
