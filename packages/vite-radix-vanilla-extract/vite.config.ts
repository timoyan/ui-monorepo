import path from "node:path";
import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const packageDir = path.dirname(fileURLToPath(import.meta.url));

/** Library entries: barrel + one file per component (each gets its own JS/CSS chunks). */
const libEntry = {
	index: path.resolve(packageDir, "src/index.ts"),
	"components/DialogDemo": path.resolve(
		packageDir,
		"src/components/DialogDemo.tsx",
	),
} as const;

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
				// Keep CSS next to component JS (e.g. components/DialogDemo.css).
				assetFileNames: (assetInfo) => {
					const base = assetInfo.names?.[0] ?? assetInfo.name ?? "asset";
					if (base.endsWith(".css")) {
						return `components/${base}`;
					}
					return base;
				},
			},
		},
		sourcemap: true,
	},
});
