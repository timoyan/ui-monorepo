import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createReduxRender, renderWithStore } from "@/test/renderWithRedux";

describe("renderWithRedux", () => {
	it("renderWithStore wraps UI with Provider and returns store", () => {
		const Dummy = () => <span>Dummy</span>;
		const { store } = renderWithStore(<Dummy />);
		expect(screen.getByText("Dummy")).toBeInTheDocument();
		expect(store.getState()).toBeDefined();
		expect(store.getState().flow).toBeDefined();
	});

	it("renderWithStore uses preloadedState when provided", () => {
		const { store } = renderWithStore(<span>App</span>, {
			preloadedState: {
				flow: {
					activeModuleId: "c",
					currencySwitchDialogOpen: true,
					cookieConfirmResult: { isAccept: null },
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		expect(store.getState().flow.activeModuleId).toBe("c");
		expect(store.getState().flow.currencySwitchDialogOpen).toBe(true);
	});

	it("createReduxRender returns store and renderWithStore using shared store", () => {
		const { store, renderWithStore: renderWithSharedStore } =
			createReduxRender();
		renderWithSharedStore(<span>Shared</span>);
		expect(screen.getByText("Shared")).toBeInTheDocument();
		expect(store.getState().flow).toBeDefined();
	});

	it("createReduxRender renderWithStore with callOptions.preloadedState uses a new store", () => {
		const { store: sharedStore, renderWithStore } = createReduxRender();
		const { store: callStore } = renderWithStore(<span>Per-call</span>, {
			preloadedState: {
				flow: {
					activeModuleId: "b-2",
					currencySwitchDialogOpen: false,
					cookieConfirmResult: { isAccept: null },
					moduleOrder: ["A", "B1", "B2", "C"],
					modulesState: {},
				},
			},
		});
		expect(screen.getByText("Per-call")).toBeInTheDocument();
		expect(callStore.getState().flow.activeModuleId).toBe("b-2");
		expect(sharedStore.getState().flow.activeModuleId).toBeNull();
	});
});
