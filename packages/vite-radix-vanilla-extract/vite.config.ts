import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const USE_CLIENT_FIRST_LINE = /^\uFEFF?\s*["']use client["']\s*;\s*$/;

/**
 * Authors put `"use client"` in entry source, but Rollup often drops it as side-effect free and
 * hoists imports above any surviving copy. Read the facade file and prepend one directive to the emit.
 */
function emitUseClientFromFacadeSource(rootDir: string): Plugin {
	const directiveLine = /^\s*["']use client["']\s*;\s*/gm;

	return {
		name: "emit-use-client-from-facade-source",
		enforce: "post",
		renderChunk(code, chunk) {
			if (!chunk.isEntry) return null;
			const facade = chunk.facadeModuleId;
			if (!facade || facade.includes("\0")) return null;
			const normalizedFacade = path.normalize(facade);
			if (!normalizedFacade.startsWith(rootDir)) return null;

			let sourceHead: string;
			try {
				sourceHead = fs.readFileSync(normalizedFacade, "utf8").slice(0, 2048);
			} catch {
				return null;
			}

			const firstLine = sourceHead.split(/\r?\n/, 1)[0] ?? "";
			if (!USE_CLIENT_FIRST_LINE.test(firstLine)) return null;

			directiveLine.lastIndex = 0;
			const stripped = code.replace(directiveLine, "");
			return { code: `"use client";\n${stripped}`, map: null };
		},
	};
}

const packageDir = path.dirname(fileURLToPath(import.meta.url));

/** Library entries: barrel + one file per component (each gets its own JS/CSS chunks). */
const libEntry = {
	index: path.resolve(packageDir, "src/index.ts"),
	"components/Dialog/Dialog": path.resolve(
		packageDir,
		"src/components/Dialog/Dialog.tsx",
	),
} as const;

/**
 * Co-locate Vanilla Extract CSS with its entry: path relative to `src/` matches dist layout
 * (e.g. `components/Dialog/Dialog.css` next to `components/Dialog/Dialog.js`).
 */
function cssAssetPathFromLibEntry(
	entry: Record<string, string>,
	root: string,
): (cssBasename: string) => string | undefined {
	const srcRoot = path.join(root, "src");
	const map = new Map<string, string>();
	for (const [key, absPath] of Object.entries(entry)) {
		if (key === "index") continue;
		const base = path.basename(absPath, path.extname(absPath));
		const relDir = path.relative(srcRoot, path.dirname(absPath));
		const posixDir = relDir.split(path.sep).join("/");
		map.set(`${base}.css`, `${posixDir}/${base}.css`);
	}
	return (cssBasename: string) => map.get(cssBasename);
}

const resolveCssAssetPath = cssAssetPathFromLibEntry(libEntry, packageDir);

/** Runtime packages shipped by the consumer app, not bundled into the library. */
function isPeerDependency(id: string): boolean {
	if (id.startsWith(".") || path.isAbsolute(id)) {
		return false;
	}
	if (
		id === "react" ||
		id === "react/jsx-runtime" ||
		id === "react-dom" ||
		id === "@radix-ui/react-dialog"
	) {
		return true;
	}
	if (id.startsWith("react/") || id.startsWith("react-dom/")) {
		return true;
	}
	if (id.startsWith("@radix-ui/react-dialog/")) {
		return true;
	}
	return false;
}

export default defineConfig({
	plugins: [
		vanillaExtractPlugin(),
		react(),
		// Injects `import './…css'` at the top of emitted chunks so apps need not import CSS manually.
		libInjectCss(),
		emitUseClientFromFacadeSource(packageDir),
	],
	build: {
		lib: {
			entry: libEntry,
			formats: ["es"],
			fileName: (_format, entryName) => `${entryName}.js`,
		},
		cssCodeSplit: true,
		rollupOptions: {
			external: isPeerDependency,
			output: {
				chunkFileNames: "chunks/[name]-[hash].js",
				// Keep CSS next to component JS (e.g. components/Dialog/Dialog.css).
				assetFileNames: (assetInfo) => {
					const base = assetInfo.names?.[0] ?? assetInfo.name ?? "asset";
					if (base.endsWith(".css")) {
						const coLocated = resolveCssAssetPath(base);
						if (coLocated) return coLocated;
						return `components/${base}`;
					}
					return base;
				},
			},
		},
		sourcemap: true,
	},
});
