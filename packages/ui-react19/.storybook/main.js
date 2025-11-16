const webpack = require("webpack");

module.exports = {
	stories: ["../src/ui/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
	],
	framework: {
		name: "@storybook/react-webpack5",
		options: {},
	},
	webpackFinal: async (config) => {
		// Add Linaria support to Storybook with wyw-in-js webpack-loader
		const jsRule = config.module.rules.find((rule) =>
			rule?.test?.toString().includes("jsx?"),
		);

		if (jsRule) {
			// Convert single loader to array if needed
			if (!Array.isArray(jsRule.use)) {
				jsRule.use = [jsRule.use];
			}

			// Find babel-loader
			const babelLoaderIndex = jsRule.use.findIndex(
				(loader) =>
					(typeof loader === "string" && loader.includes("babel-loader")) ||
					(typeof loader === "object" &&
						loader.loader &&
						loader.loader.includes("babel-loader")),
			);

			if (babelLoaderIndex !== -1) {
				const babelLoader = jsRule.use[babelLoaderIndex];

				// Ensure babel-loader has options
				if (typeof babelLoader === "object" && babelLoader.options) {
					if (!babelLoader.options.presets) {
						babelLoader.options.presets = [];
					}

					// Check if Linaria preset is already added
					const hasLinariaPreset = babelLoader.options.presets.some(
						(preset) =>
							(Array.isArray(preset) &&
								preset[0] === "@linaria/babel-preset") ||
							preset === "@linaria/babel-preset",
					);

					if (!hasLinariaPreset) {
						babelLoader.options.presets.unshift([
							"@linaria/babel-preset",
							{
								evaluate: true,
								displayName: true,
							},
						]);
					}
				}
			}

			// Add wyw-in-js/webpack-loader
			// Note: webpack loaders execute from right to left (last to first in array)
			// So we need: [babel-loader, wyw-loader] to execute wyw-loader first, then babel-loader
			// This means wyw-loader must be AFTER babel-loader in the array
			const hasWywLoader = jsRule.use.some(
				(loader) =>
					(typeof loader === "string" &&
						loader.includes("@wyw-in-js/webpack-loader")) ||
					(typeof loader === "object" &&
						loader.loader &&
						loader.loader.includes("@wyw-in-js/webpack-loader")),
			);

			if (!hasWywLoader) {
				// Insert after babel-loader (will execute before babel-loader due to webpack's right-to-left execution)
				const insertIndex =
					babelLoaderIndex !== -1 ? babelLoaderIndex + 1 : jsRule.use.length;
				jsRule.use.splice(insertIndex, 0, {
					loader: "@wyw-in-js/webpack-loader",
					options: {
						sourceMap: process.env.NODE_ENV !== "production",
						configFile: "./wyw-in-js.config.js",
					},
				});
			}
		}

		// Ensure CSS files from Linaria are handled
		const cssRule = config.module.rules.find((rule) =>
			rule?.test?.toString().includes("css"),
		);

		if (!cssRule) {
			config.module.rules.push({
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			});
		}

		config.resolve.extensions.push(".js", ".jsx", ".ts", ".tsx");

		// Force React 19 resolution for all modules (including Storybook internals)
		const reactPath = require.resolve("react");
		const reactDomPath = require.resolve("react-dom");
		const reactDomClientPath = require.resolve("react-dom/client");
		const reactJsxRuntimePath = require.resolve("react/jsx-runtime");
		const reactJsxDevRuntimePath = require.resolve("react/jsx-dev-runtime");

		config.resolve.alias = {
			...config.resolve.alias,
			react: reactPath,
			"react/": `${reactPath.replace(/[\\/]react\.js$/, "")}/`,
			"react/jsx-runtime": reactJsxRuntimePath,
			"react/jsx-dev-runtime": reactJsxDevRuntimePath,
			"react-dom": reactDomPath,
			"react-dom/": `${reactDomPath.replace(/[\\/]react-dom\.js$/, "")}/`,
			"react-dom/client": reactDomClientPath,
		};

		// Ensure Storybook's internal code also uses React 19
		config.resolve.modules = [
			...(config.resolve.modules || ["node_modules"]),
			require.resolve("react").replace(/[\\/]react\.js$/, ""),
			require.resolve("react-dom").replace(/[\\/]react-dom\.js$/, ""),
		];

		// Ensure react-dom subpaths are resolved
		if (!config.resolve.conditionNames) {
			config.resolve.conditionNames = ["import", "require", "default"];
		}

		// Ensure react-dom subpath exports work correctly
		// React 19 uses package.json exports, so we need to ensure webpack resolves them
		config.resolve.extensionAlias = {
			...config.resolve.extensionAlias,
			".js": [".js", ".jsx", ".ts", ".tsx"],
			".jsx": [".jsx", ".js"],
		};

		// Replace Storybook's React imports with React 19
		// This ensures all Storybook internals use React 19
		config.plugins = [
			...config.plugins,
			new webpack.NormalModuleReplacementPlugin(/^react$/, reactPath),
			new webpack.NormalModuleReplacementPlugin(
				/^react\/jsx-runtime$/,
				reactJsxRuntimePath,
			),
			new webpack.NormalModuleReplacementPlugin(
				/^react\/jsx-dev-runtime$/,
				reactJsxDevRuntimePath,
			),
			new webpack.NormalModuleReplacementPlugin(/^react-dom$/, reactDomPath),
			new webpack.NormalModuleReplacementPlugin(
				/^react-dom\/client$/,
				reactDomClientPath,
			),
		];

		return config;
	},
	docs: {
		autodocs: "tag",
	},
};
