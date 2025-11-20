import { styled } from "@linaria/react";
import type React from "react";
import type { ReactNode } from "react";

const variantColors = {
	primary: {
		bg: "#007bff",
		hover: "#0056b3",
		shadow: "rgba(0, 123, 255, 0.3)",
	},
	secondary: {
		bg: "#6c757d",
		hover: "#545b62",
		shadow: "rgba(108, 117, 125, 0.3)",
	},
	success: {
		bg: "#28a745",
		hover: "#218838",
		shadow: "rgba(40, 167, 69, 0.3)",
	},
	danger: { bg: "#dc3545", hover: "#c82333", shadow: "rgba(220, 53, 69, 0.3)" },
} as const;

const StyledButton = styled.button<{
	variant: "primary" | "secondary" | "success" | "danger";
}>`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  background-color: ${(props) => variantColors[props.variant].bg};

  &:hover {
    background-color: ${(props) => variantColors[props.variant].hover};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${(props) => variantColors[props.variant].shadow};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export type ButtonVariant = "primary" | "secondary" | "success" | "danger";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	children: ReactNode;
	className?: string;
}

export const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	children,
	className,
	...props
}) => {
	return (
		<StyledButton variant={variant} className={className} {...props}>
			{children}
		</StyledButton>
	);
};
