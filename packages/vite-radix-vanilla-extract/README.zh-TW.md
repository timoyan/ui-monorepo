# vite-radix-vanilla-extract

以 [Vanilla Extract](https://vanilla-extract.style/) 撰寫樣式、[Radix UI](https://www.radix-ui.com/) 為底層的 React 元件庫，採 **ESM** 輸出，可發佈至 npm。

> 英文版說明見 [README.md](./README.md)。

---

## 特色

- **ESM**：`type: "module"`，`exports` 對應 `dist`。
- **Peer dependencies**：`react`、`react-dom` 與使用的 Radix 套件由使用端安裝，不會被打進套件 bundle。
- **每個元件獨立輸出**：例如 `dist/components/Dialog/Dialog.js` 與對應的 `dist/components/Dialog/Dialog.css`（若有樣式，目錄對應 `src/components/...`）。
- **樣式載入**：建置時透過 `vite-plugin-lib-inject-css` 在元件 JS 內插入 `import './<Name>.css'`，一般情況下**使用端不必再手動** `import` CSS。
- **Next.js App Router**：請在每個函式庫**入口**原始檔的第一行寫 `"use client";`（`src/index.ts`、`src/components/<Name>.tsx`）。建置時 Vite 插件會從該 facade 檔讀取並寫回發佈檔**最上方**，讓指令位於任何 `import` 之前（Rollup 否則可能刪除或重排）。共用的 `dist/chunks/*` 不含此指令——請僅透過 `package.json` 的 `exports` 路徑匯入。
- **Tree-shaking 友善**：`sideEffects` 標記為 `**/*.css`，其餘 ESM 可由 bundler 分析。

---

## 對等依賴（peer dependencies）

請在使用專案中自行安裝（版本範圍以 `package.json` 的 `peerDependencies` 為準）：

- `react`
- `react-dom`
- `@radix-ui/react-dialog`（目前範例元件 `Dialog` 使用）

若未來元件使用其他 `@radix-ui/*` 套件，請一併加入 peer，並在本 repo 的 `vite.config.ts` 將該套件標為 `external`（見 `isPeerDependency`）。

---

## 安裝

```bash
pnpm add vite-radix-vanilla-extract
# 或 npm / yarn；記得安裝 peer dependencies
```

在 monorepo 內可透過 workspace 協定依專案設定連結本套件。

---

## 使用端建置與 CSS

- 發佈後的元件**入口**（例如 `dist/components/Dialog/Dialog.js`）開頭為 `"use client";`（供 Next.js 使用），接著才是 ESM `import`，其中包含由 `vite-plugin-lib-inject-css` 注入的相對路徑 `import "./Dialog.css"`。
- **你的應用打包工具**（Vite、Webpack、Next.js、Rspack 等）在 bundle 時必須能**解析並處理**來自 `node_modules` 的 `.css` import（與處理你自己專案裡的 `import './foo.css'` 相同）。
- 常見 React 範本通常已內建 CSS loader，**多數情況無需額外設定**。
- 若工具鏈**完全不處理** CSS import，樣式不會進入建置結果；請調整建置設定，或改用手動 `import "…/components/Dialog/Dialog.css"` 並同樣確保該路徑會被處理。
- 使用 **TypeScript** 時，若型別檢查會跟到套件內的 `.css` import，可能需在應用專案加上 `declare module "*.css"`（依你的 `tsconfig` 與 bundler 而定）。

### Next.js App Router 與 CSS 順序

Next.js 要求 `"use client"` 必須出現在任何 `import` **之前**。請在每個入口模組的**第一行**撰寫該指令；建置插件（`vite.config.ts` 的 `emit-use-client-from-facade-source`）會讀取 facade 原始檔並在產物開頭插入一行 `"use client";`，因此在 Rollup 提升 `import` 與 `vite-plugin-lib-inject-css` 注入 CSS 之後，順序仍正確。一般不需在應用程式再手動 `import` CSS；Next 的 bundler 會像處理其他依賴一樣解析套件內注入的 `./Dialog.css`。非 Next 專案會把 `"use client"` 視為無作用的字串陳述式。

---

## 使用方式

### 從套件根匯入（barrel）

```tsx
import { Dialog } from "vite-radix-vanilla-extract";

export function Page() {
	return <Dialog />;
}
```

`Dialog` 的對應 CSS 會隨 JS 模組一併被 bundler 解析，通常**不需要**再寫 `import "...css"`。

### 從子路徑匯入

```tsx
import { Dialog } from "vite-radix-vanilla-extract/components/Dialog/Dialog";
```

若需單獨引用樣式（例如特殊打包流程）：

```ts
import "vite-radix-vanilla-extract/components/Dialog/Dialog.css";
```

實際路徑以 `package.json` 的 `exports` 為準。

---

## `exports` 一覽

| 子路徑 | 說明 |
|--------|------|
| `.` | 主入口：`dist/index.js` + 型別 |
| `./components/Dialog/Dialog` | 單一元件入口 |
| `./components/Dialog/Dialog.css` | 該元件的靜態 CSS（選用） |

新增元件後請同步更新 `package.json` 的 `exports`。

---

## 在本 repo 內開發與建置

```bash
# 於 monorepo 根目錄
pnpm --filter vite-radix-vanilla-extract run build
```

- `build`：`vite build` 產出 JS/CSS，接著 `tsc -p tsconfig.build.json` 產出 `.d.ts`。
- `dev`：`vite build --watch`，方便迭代（型別需另行執行完整 `build` 或單跑 `tsc`）。

---

## 發佈與 Git 標籤（monorepo）

本套件位於 monorepo，日後若有多個可發佈套件，**建議**使用「含 npm 套件名」的 tag，一眼能看出對應哪個套件與版號，不要只用整 repo 通用的 `v0.1.0`：

```text
vite-radix-vanilla-extract@<semver>
```

在 `package.json` 的 `version` 已對齊要發佈的版號（例如 `0.1.0`）、且已落在目標 commit 上時：

```bash
git tag -a "vite-radix-vanilla-extract@0.1.0" -m "vite-radix-vanilla-extract 0.1.0"
git push origin "vite-radix-vanilla-extract@0.1.0"
```

接著依團隊流程在本機或 CI 建置 `dist` 後執行 `npm publish`／`pnpm publish`。

---

## 新增一個元件時要做的事

1. 在 `src/components/` 新增 `<Name>.tsx`，**第一行**為 `"use client";`；若用 Vanilla Extract，新增 `<Name>.css.ts` 並在元件內 `import * as styles from "./<Name>.css"`。
2. 在 `vite.config.ts` 的 `libEntry` 新增一筆，例如：`"components/Dialog/Dialog": path.resolve(packageDir, "src/components/Dialog/Dialog.tsx")`（路徑對應 `src/`）。
3. 在 `package.json` 的 `exports` 新增 `./components/.../<Name>` 與（若有）`./components/.../<Name>.css`。
4. 在 `src/index.ts` 從新元件 re-export。
5. 若使用**新的** Radix 套件：加入 `peerDependencies` / `devDependencies`，並在 `isPeerDependency` 中把該套件與子路徑標成 external。
6. 執行 `pnpm --filter vite-radix-vanilla-extract run build`，確認 `dist` 與型別無誤。

---

## 與 `preserveModules` 的關係

若日後在 Rollup 輸出啟用 **`preserveModules`**，目前使用的 **`vite-plugin-lib-inject-css` 與其不相容**（插件依 chunk 模型運作）。若需要 `preserveModules`，請改採建置後腳本插入 `import './xxx.css'`、自寫 Rollup 插件，或其他策略；詳見社群 issue 與 Vite/Rollup 文件。

---

## 授權

MIT（見套件根目錄 `package.json` 的 `license` 欄位）。
