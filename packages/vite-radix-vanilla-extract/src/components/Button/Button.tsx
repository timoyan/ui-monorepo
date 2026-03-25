"use client";

import type { ButtonHTMLAttributes } from "react";
import * as styles from "./Button.css";

export type ButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"color"
> & {
	tone?: "neutral" | "danger";
	variant?: "solid" | "outline" | "ghost";
	size?: "sm" | "md";
};

function Button({
	tone = "neutral",
	variant = "solid",
	size = "md",
	className,
	type = "button",
	...rest
}: ButtonProps) {
	const composed = [styles.button({ tone, variant, size }), className]
		.filter(Boolean)
		.join(" ");

	return <button {...rest} type={type} className={composed} />;
}

export { Button };
export default Button;
