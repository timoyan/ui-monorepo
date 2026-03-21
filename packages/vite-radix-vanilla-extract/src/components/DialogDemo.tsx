"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as styles from "./DialogDemo.css";

export type DialogDemoProps = {
	triggerTone?: "neutral" | "danger";
	overlayIntensity?: "subtle" | "strong";
	closeAppearance?: "secondary" | "ghost";
};

function DialogDemo({
	triggerTone = "neutral",
	overlayIntensity = "strong",
	closeAppearance = "secondary",
}: DialogDemoProps) {
	return (
		<Dialog.Root>
			<Dialog.Trigger
				className={styles.trigger({ tone: triggerTone })}
				type="button"
			>
				Open dialog
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay
					className={styles.overlay({ intensity: overlayIntensity })}
				/>
				<Dialog.Content className={styles.content}>
					<Dialog.Title className={styles.title}>
						Radix + Vanilla Extract
					</Dialog.Title>
					<Dialog.Description className={styles.description}>
						Trigger, overlay, and close use @vanilla-extract/recipes so variants
						map cleanly to props.
					</Dialog.Description>
					<Dialog.Close
						className={styles.close({ appearance: closeAppearance })}
						type="button"
					>
						Close
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export { DialogDemo };
export default DialogDemo;
