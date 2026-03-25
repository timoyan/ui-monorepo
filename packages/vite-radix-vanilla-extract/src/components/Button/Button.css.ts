import { recipe } from "@vanilla-extract/recipes";

export const button = recipe({
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		fontWeight: 500,
		fontFamily: "inherit",
		cursor: "pointer",
		borderRadius: 8,
		borderStyle: "solid",
		borderWidth: 1,
		transition:
			"background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
	},
	variants: {
		size: {
			sm: {
				padding: "6px 12px",
				fontSize: "0.875rem",
			},
			md: {
				padding: "10px 16px",
				fontSize: "0.95rem",
			},
		},
		tone: {
			neutral: {},
			danger: {},
		},
		variant: {
			solid: {},
			outline: {},
			ghost: {},
		},
	},
	compoundVariants: [
		{
			variants: { tone: "neutral", variant: "solid" },
			style: {
				backgroundColor: "#111",
				color: "#fff",
				borderColor: "#111",
				":hover": { backgroundColor: "#333", borderColor: "#333" },
			},
		},
		{
			variants: { tone: "neutral", variant: "outline" },
			style: {
				backgroundColor: "transparent",
				color: "#111",
				borderColor: "#c4c4c4",
				":hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
			},
		},
		{
			variants: { tone: "neutral", variant: "ghost" },
			style: {
				backgroundColor: "transparent",
				color: "#444",
				borderColor: "transparent",
				":hover": { backgroundColor: "rgba(0, 0, 0, 0.06)" },
			},
		},
		{
			variants: { tone: "danger", variant: "solid" },
			style: {
				backgroundColor: "#b42318",
				color: "#fff",
				borderColor: "#8a1c12",
				":hover": { backgroundColor: "#8a1c12" },
			},
		},
		{
			variants: { tone: "danger", variant: "outline" },
			style: {
				backgroundColor: "transparent",
				color: "#b42318",
				borderColor: "#d92d20",
				":hover": { backgroundColor: "rgba(180, 35, 24, 0.08)" },
			},
		},
		{
			variants: { tone: "danger", variant: "ghost" },
			style: {
				backgroundColor: "transparent",
				color: "#b42318",
				borderColor: "transparent",
				":hover": { backgroundColor: "rgba(180, 35, 24, 0.08)" },
			},
		},
	],
	defaultVariants: {
		size: "md",
		tone: "neutral",
		variant: "solid",
	},
});
