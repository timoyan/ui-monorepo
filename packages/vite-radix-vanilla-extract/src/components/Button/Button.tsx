"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import * as React from "react";
import * as styles from "./Button.css";

export type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"color"
> & {
	tone?: "neutral" | "danger";
	variant?: "solid" | "outline" | "ghost";
	size?: "sm" | "md";
	/** When true, merges styles and props onto the single child (Radix Slot pattern). */
	asChild?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{
		tone = "neutral",
		variant = "solid",
		size = "md",
		className,
		type = "button",
		asChild = false,
		...rest
	},
	ref,
) {
	const Comp = asChild ? Slot : "button";
	const composed = [styles.button({ tone, variant, size }), className]
		.filter(Boolean)
		.join(" ");

	return (
		<Comp
			ref={ref}
			className={composed}
			{...(asChild ? {} : { type })}
			{...rest}
		/>
	);
});

Button.displayName = "Button";

export { Button };
export default Button;
