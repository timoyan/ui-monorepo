"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as styles from "./Dialog.css";

export type DialogProps = {
	triggerTone?: "neutral" | "danger";
	overlayIntensity?: "subtle" | "strong";
	closeAppearance?: "secondary" | "ghost";
};

function Dialog({
	triggerTone = "neutral",
	overlayIntensity = "strong",
	closeAppearance = "secondary",
}: DialogProps) {
	return (
		<DialogPrimitive.Root>
			<DialogPrimitive.Trigger
				className={styles.trigger({ tone: triggerTone })}
				type="button"
			>
				Open dialog
			</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay
					className={styles.overlay({ intensity: overlayIntensity })}
				/>
				<DialogPrimitive.Content className={styles.content}>
					<DialogPrimitive.Title className={styles.title}>
						Radix + Vanilla Extract
					</DialogPrimitive.Title>
					<DialogPrimitive.Description className={styles.description}>
						Trigger, overlay, and close use @vanilla-extract/recipes so variants
						map cleanly to props.
					</DialogPrimitive.Description>
					<DialogPrimitive.Close
						className={styles.close({ appearance: closeAppearance })}
						type="button"
					>
						Close
					</DialogPrimitive.Close>
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

export { Dialog };
export default Dialog;
