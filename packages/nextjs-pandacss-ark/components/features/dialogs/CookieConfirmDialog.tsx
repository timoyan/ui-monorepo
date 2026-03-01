"use client";

import { Button } from "@/components/atomics/button";
import {
	Dialog,
	DialogBackdrop,
	DialogContent,
	DialogDescription,
	DialogPortal,
	DialogPositioner,
	DialogTitle,
} from "@/components/atomics/dialog";
import { useFlow } from "@/core/flow/useFlow";
import { css } from "@/styled-system/css";

const actionsClass = css({
	display: "flex",
	gap: 3,
	justifyContent: "flex-end",
	mt: 2,
});

/**
 * Cookie consent dialog. Shown when cookieConfirm is null (not yet answered).
 * Both Accept and Decline close the dialog; result is persisted in sessionStorage so it does not reappear on refresh.
 * Controlled via useFlow: showCookieConfirm, setCookieConfirm.
 */
export function CookieConfirmDialog() {
	const { showCookieConfirm, setCookieConfirm } = useFlow();

	return (
		<Dialog.Root
			open={showCookieConfirm}
			onOpenChange={(details) => {
				if (!details.open) {
					// User closed without choosing (e.g. Escape) – treat as decline
					setCookieConfirm(false);
				}
			}}
			modal
			closeOnInteractOutside={false}
			lazyMount
			unmountOnExit
		>
			<DialogPortal>
				<DialogBackdrop />
				<DialogPositioner>
					<DialogContent>
						<DialogTitle>Cookie consent</DialogTitle>
						<DialogDescription>
							We use cookies to improve your experience. Do you accept our use
							of cookies?
						</DialogDescription>
						<div className={actionsClass}>
							<Button
								variant="secondary"
								onClick={() => setCookieConfirm(false)}
							>
								Decline
							</Button>
							<Button variant="primary" onClick={() => setCookieConfirm(true)}>
								Accept
							</Button>
						</div>
					</DialogContent>
				</DialogPositioner>
			</DialogPortal>
		</Dialog.Root>
	);
}
