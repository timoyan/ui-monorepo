import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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

describe("Dialog components", () => {
	it("renders Dialog.Root with content when open", () => {
		render(
			<Dialog.Root open>
				<DialogPortal>
					<DialogBackdrop />
					<DialogPositioner>
						<DialogContent>
							<DialogTitle>Test title</DialogTitle>
							<DialogDescription>Test description</DialogDescription>
						</DialogContent>
					</DialogPositioner>
				</DialogPortal>
			</Dialog.Root>,
		);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /test title/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/test description/i)).toBeInTheDocument();
	});

	it("exports DialogCloseTrigger for use in dialogs", () => {
		expect(DialogCloseTrigger).toBeDefined();
	});
});
