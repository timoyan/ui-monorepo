import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CurrencySwitchDialog } from "@/components/features/dialogs/CurrencySwitchDialog";
import { renderWithStore } from "@/test/renderWithRedux";

describe("CurrencySwitchDialog", () => {
	it("does not show dialog content when closed", () => {
		renderWithStore(<CurrencySwitchDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: false,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		expect(
			screen.queryByRole("heading", { name: /switch currency/i }),
		).not.toBeInTheDocument();
	});

	it("shows dialog with title and currency options when open", () => {
		renderWithStore(<CurrencySwitchDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: true,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		expect(
			screen.getByRole("heading", { name: /switch currency/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/select your preferred currency/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /TWD \(NT\$\)/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /USD \(\$\)/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
	});

	it("closes dialog when a currency button is clicked", async () => {
		const { store } = renderWithStore(<CurrencySwitchDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: true,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		await userEvent.click(screen.getByRole("button", { name: /USD \(\$\)/i }));
		expect(store.getState().flow.currencySwitchDialogOpen).toBe(false);
	});

	it("closes dialog when Close button is clicked", async () => {
		const { store } = renderWithStore(<CurrencySwitchDialog />, {
			preloadedState: {
				flow: {
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: true,
					activeModuleId: null,
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		await userEvent.click(screen.getByRole("button", { name: /close/i }));
		expect(store.getState().flow.currencySwitchDialogOpen).toBe(false);
	});
});
