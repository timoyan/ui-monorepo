import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const fadeIn = keyframes({
	"0%": { opacity: 0 },
	"100%": { opacity: 1 },
});

export const trigger = recipe({
	base: {
		padding: "10px 16px",
		borderRadius: 8,
		border: "1px solid #c4c4c4",
		fontSize: "0.95rem",
		cursor: "pointer",
	},
	variants: {
		tone: {
			neutral: {
				backgroundColor: "#111",
				color: "#fff",
				":hover": { backgroundColor: "#333" },
			},
			danger: {
				backgroundColor: "#b42318",
				color: "#fff",
				borderColor: "#8a1c12",
				":hover": { backgroundColor: "#8a1c12" },
			},
		},
	},
	defaultVariants: {
		tone: "neutral",
	},
});

export const overlay = recipe({
	base: {
		position: "fixed",
		inset: 0,
		animation: `${fadeIn} 150ms ease-out`,
	},
	variants: {
		intensity: {
			subtle: { backgroundColor: "rgba(0, 0, 0, 0.25)" },
			strong: { backgroundColor: "rgba(0, 0, 0, 0.45)" },
		},
	},
	defaultVariants: {
		intensity: "strong",
	},
});

export const content = style({
	position: "fixed",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "min(90vw, 420px)",
	padding: 24,
	borderRadius: 12,
	backgroundColor: "#fff",
	boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)",
});

export const title = style({
	margin: "0 0 8px",
	fontSize: "1.125rem",
	fontWeight: 600,
});

export const description = style({
	margin: "0 0 20px",
	color: "#444",
	fontSize: "0.9rem",
	lineHeight: 1.5,
});

export const close = recipe({
	base: {
		padding: "8px 14px",
		borderRadius: 8,
		cursor: "pointer",
		fontSize: "0.9rem",
	},
	variants: {
		appearance: {
			secondary: {
				border: "1px solid #ccc",
				backgroundColor: "#f5f5f5",
				":hover": { backgroundColor: "#ebebeb" },
			},
			ghost: {
				border: "1px solid transparent",
				backgroundColor: "transparent",
				color: "#444",
				":hover": { backgroundColor: "rgba(0, 0, 0, 0.06)" },
			},
		},
	},
	defaultVariants: {
		appearance: "secondary",
	},
});
