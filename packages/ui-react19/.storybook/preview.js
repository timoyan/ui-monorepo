import React from "react";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/i,
		},
	},
};

export const decorators = [
	(Story) => {
		return React.createElement(
			React.StrictMode,
			null,
			React.createElement(Story),
		);
	},
];
