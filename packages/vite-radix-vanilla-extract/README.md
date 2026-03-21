# vite-radix-vanilla-extract

A React component library styled with [Vanilla Extract](https://vanilla-extract.style/) and built on [Radix UI](https://www.radix-ui.com/), shipped as **ESM** and publishable to npm.

**Traditional Chinese (繁體中文):** [README.zh-TW.md](./README.zh-TW.md)

---

## Highlights

- **ESM**: `type: "module"` with `exports` pointing at `dist`.
- **Peer dependencies**: `react`, `react-dom`, and Radix packages are installed by the app and are not bundled into the library.
- **Per-component outputs**: `dist/components/<Name>.js` plus matching `dist/components/<Name>.css` when styles exist.
- **CSS loading**: The build injects `import './<Name>.css'` into component chunks via `vite-plugin-lib-inject-css`, so consumers usually **do not** need a separate CSS `import`.
- **Tree-shaking friendly**: `sideEffects` is limited to `**/*.css`; other ESM can be analyzed by bundlers.

---

## Peer dependencies

Install these in the consuming app (see `peerDependencies` in `package.json` for ranges):

- `react`
- `react-dom`
- `@radix-ui/react-dialog` (used by the sample `DialogDemo`)

If you add components that use other `@radix-ui/*` packages, add them as peers and mark them `external` in this repo’s `vite.config.ts` (`isPeerDependency`).

---

## Installation

```bash
pnpm add vite-radix-vanilla-extract
# or npm / yarn; remember to install peer dependencies
```

Inside a monorepo, link this package with your workspace protocol as usual.

---

## Consumer bundling & CSS

- Published component JS (e.g. `dist/components/DialogDemo.js`) starts with a relative `import "./DialogDemo.css"` (injected by `vite-plugin-lib-inject-css`).
- Your **app bundler** (Vite, Webpack, Next.js, Rspack, etc.) must **resolve and process** `.css` imports from `node_modules` during the build—the same as `import './foo.css'` in your own code.
- Typical React setups already include a CSS pipeline; **usually no extra config**.
- If the toolchain **does not** handle CSS imports, styles never enter the bundle; fix the build or import `./components/DialogDemo.css` explicitly and ensure that path is processed.
- With **TypeScript**, you may need `declare module "*.css"` in the app if typechecking follows CSS imports from dependencies (depends on `tsconfig` and bundler).

---

## Usage

### Root import (barrel)

```tsx
import { DialogDemo } from "vite-radix-vanilla-extract";

export function Page() {
	return <DialogDemo />;
}
```

The CSS for `DialogDemo` is pulled in with the JS module; you usually **do not** need an extra `import "...css"`.

### Subpath import

```tsx
import { DialogDemo } from "vite-radix-vanilla-extract/components/DialogDemo";
```

To import styles alone (e.g. custom bundling):

```ts
import "vite-radix-vanilla-extract/components/DialogDemo.css";
```

Authoritative paths are defined in `package.json` → `exports`.

---

## `exports` map

| Subpath | Description |
|---------|-------------|
| `.` | Main entry: `dist/index.js` + types |
| `./components/DialogDemo` | Single-component entry |
| `./components/DialogDemo.css` | Static CSS for that component (optional) |

When you add a component, update `exports` in `package.json` accordingly.

---

## Develop & build in this repo

```bash
# from monorepo root
pnpm --filter vite-radix-vanilla-extract run build
```

- `build`: `vite build` emits JS/CSS, then `tsc -p tsconfig.build.json` emits `.d.ts`.
- `dev`: `vite build --watch` for iteration (run full `build` or `tsc` separately for types).

---

## Checklist: add a component

1. Add `src/components/<Name>.tsx`; with Vanilla Extract, add `<Name>.css.ts` and `import * as styles from "./<Name>.css"` in the component.
2. Add an entry to `libEntry` in `vite.config.ts`, e.g. `"components/<Name>": path.resolve(packageDir, "src/components/<Name>.tsx")`.
3. Add `./components/<Name>` and (if applicable) `./components/<Name>.css` to `exports` in `package.json`.
4. Re-export from `src/index.ts`.
5. For **new** Radix packages: add `peerDependencies` / `devDependencies` and mark the package and subpaths external in `isPeerDependency`.
6. Run `pnpm --filter vite-radix-vanilla-extract run build` and verify `dist` and types.

---

## `preserveModules` note

If you enable Rollup **`preserveModules`**, the current **`vite-plugin-lib-inject-css` setup is incompatible** (it assumes chunk-based output). Use a post-build CSS import injection, a custom Rollup plugin, or another approach; see community issues and Vite/Rollup docs.

---

## License

MIT — see the `license` field in this package’s `package.json`.
