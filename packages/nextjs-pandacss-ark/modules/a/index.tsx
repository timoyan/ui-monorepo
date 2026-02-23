import {
	Accordion,
	AccordionItem,
	AccordionItemContent,
	AccordionItemTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { registerToastContent, useToast } from "@/core/toast";
import { css } from "@/styled-system/css";

// Register toast content in global registry before use (e.g. at module load).
// For HTML in description, render in the registry entry; toast layer does not parse HTML strings.
registerToastContent("success-html", {
	title: "HTML in toast",
	description: (
		<span>
			You can use <strong>bold</strong> and <em>italic</em> from the registry.
		</span>
	),
	icon: (
		<span aria-hidden style={{ marginRight: "0.5rem" }}>
			📄
		</span>
	),
});

const toastDemoRowStyles = css({
	display: "flex",
	gap: "0.75rem",
	flexWrap: "wrap",
	marginTop: "1rem",
});

/** One-time dynamic toast: React component used as description; unregisterOnDismiss cleans up. */
export function DynamicToastDescription({
	at,
	onTriggerAnother,
}: {
	at: string;
	onTriggerAnother?: () => void;
}) {
	return (
		<span>
			One-time toast created at <strong>{at}</strong>. Dismiss to unregister.
			{onTriggerAnother ? (
				<>
					{" "}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onTriggerAnother();
						}}
						className={css({
							marginLeft: "0.25rem",
							textDecoration: "underline",
							cursor: "pointer",
							background: "transparent",
							border: "none",
							padding: 0,
							font: "inherit",
							color: "inherit",
						})}
					>
						Trigger another toast
					</button>
				</>
			) : null}
		</span>
	);
}

/**
 * Module A: business module entry. Aggregate features and coordinate interactions here.
 */
export function ModuleA() {
	const { toast, registerAndToast } = useToast();

	const showSecondToast = () => {
		registerAndToast(
			{
				title: "Second toast",
				description: "Triggered from inside the first toast.",
				icon: (
					<span aria-hidden style={{ marginRight: "0.5rem" }}>
						🔔
					</span>
				),
			},
			{ type: "success", unregisterOnDismiss: true },
		);
	};

	const showDynamicToast = () => {
		const at = new Date().toLocaleTimeString();
		registerAndToast(
			{
				title: "Dynamic toast (React component)",
				description: (
					<DynamicToastDescription at={at} onTriggerAnother={showSecondToast} />
				),
				icon: (
					<span aria-hidden style={{ marginRight: "0.5rem" }}>
						🔄
					</span>
				),
			},
			{ type: "error", unregisterOnDismiss: true },
		);
	};

	return (
		<div>
			<Accordion defaultValue={["item-1"]}>
				<AccordionItem value="item-1">
					<AccordionItemTrigger>What is PandaCSS?</AccordionItemTrigger>
					<AccordionItemContent>
						PandaCSS is a build-time CSS-in-JS framework with zero runtime
						overhead. Styles are extracted at build time.
					</AccordionItemContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionItemTrigger>What is Ark UI?</AccordionItemTrigger>
					<AccordionItemContent>
						Ark UI is a headless, accessible component library. Style it with
						PandaCSS using data-scope and data-part attributes.
					</AccordionItemContent>
				</AccordionItem>
			</Accordion>
			<div className={toastDemoRowStyles}>
				<span
					className={css({
						alignSelf: "center",
						fontSize: "sm",
						color: "gray.600",
					})}
				>
					Toast (event handler):
				</span>
				<Button
					variant="primary"
					size="sm"
					onClick={() =>
						toast.success({
							title: "Success — saved",
							description: "Triggered from Module A button click.",
						})
					}
				>
					Success toast
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						toast.info({
							title: "Info",
							description: "Centralized toast from module.",
						})
					}
				>
					Info toast
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						toast.success({
							title: "Fallback title",
							description: "Overridden by registry when contentKey is set.",
							meta: { contentKey: "success-with-icon" },
						})
					}
				>
					Toast (registry)
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						toast.success({
							title: "HTML demo",
							description: "Fallback text.",
							meta: { contentKey: "success-html" },
						})
					}
				>
					Toast (HTML via registry)
				</Button>
				<Button variant="secondary" size="sm" onClick={showDynamicToast}>
					Toast (one-time dynamic + React component)
				</Button>
			</div>
		</div>
	);
}
