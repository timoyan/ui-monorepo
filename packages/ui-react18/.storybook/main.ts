import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "node:path";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-links",
		"@storybook/addon-a11y",
	],
	framework: {
		name: "@storybook/react-webpack5",
		options: {},
	},
	typescript: {
		check: false,
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) =>
				prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
		},
	},
	webpackFinal: async (config) => {
		// Add support for Linaria and the existing webpack setup
		if (!config.module) {
			config.module = { rules: [] };
		}

		if (!config.module.rules) {
			config.module.rules = [];
		}

		// Find and modify the rule that handles TypeScript/JavaScript source files
		// Storybook typically uses esbuild-loader, but we need babel-loader for Linaria
		// We need to ensure babel-loader runs BEFORE Storybook's loaders
		const sourceFileRules = config.module.rules
			.map((rule, index) => ({ rule, index }))
			.filter(({ rule }) => {
				if (typeof rule !== "object" || rule === null) return false;
				if (!("test" in rule)) return false;
				const test = rule.test;
				if (test instanceof RegExp) {
					// Match rules that handle .ts, .tsx, .js, .jsx files
					return (
						test.test(".ts") ||
						test.test(".tsx") ||
						test.test(".js") ||
						test.test(".jsx")
					);
				}
				return false;
			});

		// Remove Storybook's default TypeScript/JavaScript rules
		// We'll replace them with babel-loader
		for (const { index } of sourceFileRules.reverse()) {
			config.module.rules.splice(index, 1);
		}

		// Add our babel-loader rule at the beginning
		// This ensures TypeScript is transformed before Storybook's loaders process it
		// Webpack processes rules in order, so putting this first ensures it runs first
		config.module.rules.unshift({
			test: /\.(ts|tsx|js|jsx)$/,
			exclude: /node_modules/,
			include: [
				path.resolve(__dirname, "../src"),
				path.resolve(__dirname, "../.storybook"),
			],
			use: [
				{
					loader: "babel-loader",
					options: {
						configFile: path.resolve(__dirname, "../babel.config.json"),
					},
				},
				{
					loader: "@wyw-in-js/webpack-loader",
					options: {
						sourceMap: true,
						configFile: path.resolve(__dirname, "../wyw-in-js.config.js"),
					},
				},
			],
		});

		// Ensure CSS files are handled properly
		const cssRule = config.module.rules.find(
			(rule) =>
				typeof rule === "object" &&
				rule !== null &&
				"test" in rule &&
				rule.test instanceof RegExp &&
				rule.test.test(".css"),
		);

		if (!cssRule) {
			config.module.rules.push({
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			});
		}

		return config;
	},
};

export default config;
