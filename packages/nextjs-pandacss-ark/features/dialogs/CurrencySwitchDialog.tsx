"use client";

import { useFlow } from "@/core/flow/useFlow";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogBackdrop,
	DialogCloseTrigger,
	DialogContent,
	DialogDescription,
	DialogPortal,
	DialogPositioner,
	DialogTitle,
} from "@/components/ui/dialog";
import { css } from "@/styled-system/css";

const actionsClass = css({
	display: "flex",
	gap: 2,
	flexWrap: "wrap",
	mt: 2,
});

const CURRENCIES = [
	{ code: "TWD", label: "TWD (NT$)" },
	{ code: "USD", label: "USD ($)" },
	{ code: "EUR", label: "EUR (€)" },
	{ code: "JPY", label: "JPY (¥)" },
] as const;

/**
 * Currency switch dialog. Visibility is controlled by useFlow.currencySwitchDialogOpen
 * (set to true when user triggers a currency change; set to false when user selects or closes).
 * Use setCurrencySwitchDialogOpen(true) from header/actions to open.
 */
export function CurrencySwitchDialog() {
	const { currencySwitchDialogOpen, setCurrencySwitchDialogOpen } = useFlow();

	return (
		<Dialog.Root
			open={currencySwitchDialogOpen}
			onOpenChange={(details) => setCurrencySwitchDialogOpen(details.open)}
			modal
		>
			<DialogPortal>
				<DialogBackdrop />
				<DialogPositioner>
					<DialogContent>
						<DialogTitle>Switch currency</DialogTitle>
						<DialogDescription>
							Select your preferred currency. This is based on your current
							operation state.
						</DialogDescription>
						<div className={actionsClass}>
							{CURRENCIES.map(({ code, label }) => (
								<Button
									key={code}
									variant="secondary"
									size="sm"
									onClick={() => {
										// In a real app: persist selection, then close
										setCurrencySwitchDialogOpen(false);
									}}
								>
									{label}
								</Button>
							))}
						</div>
						<DialogCloseTrigger asChild>
							<Button variant="ghost" size="sm">
								Close
							</Button>
						</DialogCloseTrigger>
					</DialogContent>
				</DialogPositioner>
			</DialogPortal>
		</Dialog.Root>
	);
}
