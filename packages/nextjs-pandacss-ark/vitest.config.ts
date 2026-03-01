import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "."),
		},
	},
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./test/setup.ts"],
		reporters: [
			"default",
			["vitest-sonar-reporter", { outputFile: "test-result/sonar-report.xml" }],
		],
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/styled-system/**",
			"**/.next/**",
			"**/test-result/**",
			"**/*.config.{js,mjs,ts}",
			"**/mockServiceWorker.js",
			"**/*.example.{ts,tsx}",
			"**/mocks/**",
			"**/pages/**",
			"**/scripts/**",
		],
		coverage: {
			provider: "istanbul",
			reporter: ["text-summary", "lcov"],
			reportsDirectory: "test-result/coverage",
			exclude: [
				"**/node_modules/**",
				"**/dist/**",
				"**/styled-system/**",
				"**/.next/**",
				"**/test-result/**",
				"**/*.config.{js,mjs,ts}",
				"**/mockServiceWorker.js",
				"**/*.example.{ts,tsx}",
				"**/mocks/**",
				"**/pages/**",
				"**/scripts/**",
			],
		},
	},
});
