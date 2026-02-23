import stencil from "unplugin-stencil/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./test/setup.ts"],
		exclude: ["**/node_modules/**", "**/dist/**"],
	},
	plugins: [stencil()],
});
