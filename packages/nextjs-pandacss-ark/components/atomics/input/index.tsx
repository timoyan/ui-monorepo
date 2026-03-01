import { forwardRef } from "react";
import { styled } from "@/styled-system/jsx";

const StyledInput = styled("input", {
	base: {
		display: "block",
		width: "full",
		px: 3,
		py: 2,
		fontSize: "md",
		lineHeight: "normal",
		color: "gray.900",
		bg: "white",
		borderWidth: "1px",
		borderColor: "gray.300",
		borderRadius: "md",
		transition: "border-color 0.2s, box-shadow 0.2s",
		_placeholder: { color: "gray.500" },
		_hover: { borderColor: "gray.400" },
		_focus: {
			outline: "none",
			borderColor: "blue.500",
			boxShadow: "0 0 0 2px var(--colors-blue-200)",
		},
		_disabled: {
			opacity: 0.6,
			cursor: "not-allowed",
			bg: "gray.50",
		},
	},
});

export const Input = forwardRef<
	HTMLInputElement,
	React.ComponentProps<typeof StyledInput>
>((props, ref) => <StyledInput ref={ref} {...props} />);

Input.displayName = "Input";
