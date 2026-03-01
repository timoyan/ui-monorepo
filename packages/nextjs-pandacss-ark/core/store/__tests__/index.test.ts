import { HYDRATE } from "next-redux-wrapper";
import { describe, expect, it } from "vitest";
import {
	type AppStore,
	createTestStore,
	makeStore,
	type RootState,
} from "@/core/store";

describe("store", () => {
	describe("rootReducer HYDRATE", () => {
		it("merges action.payload into state when action.type is HYDRATE", () => {
			const store = createTestStore({
				flow: {
					modulesState: {},
					moduleOrder: ["A", "B1", "B2", "C"],
					activeModuleId: null,
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: false,
				},
			});
			const payload: Partial<RootState> = {
				flow: {
					modulesState: {
						A: {
							name: "A",
							state: "COMPLETED",
							message: "Done",
							timestamp: 1,
						},
					},
					moduleOrder: ["A", "B1", "B2", "C"],
					activeModuleId: "a",
					cookieConfirmResult: { isAccept: null },
					currencySwitchDialogOpen: false,
				},
			};
			store.dispatch({ type: HYDRATE, payload });
			const state = store.getState();
			expect(state.flow.modulesState.A).toEqual({
				name: "A",
				state: "COMPLETED",
				message: "Done",
				timestamp: 1,
			});
			expect(state.flow.activeModuleId).toBe("a");
		});
	});

	describe("makeStore", () => {
		it("returns a store with getState, dispatch, subscribe", () => {
			const store = makeStore() as AppStore;
			expect(typeof store.getState).toBe("function");
			expect(typeof store.dispatch).toBe("function");
			expect(typeof store.subscribe).toBe("function");
			expect(store.getState()).toBeDefined();
			expect(store.getState().flow).toBeDefined();
			expect(store.getState().module).toBeDefined();
			expect(store.getState().module.byModuleId).toEqual({});
		});
	});

	describe("createTestStore", () => {
		it("returns a store that uses rootReducer with preloadedState", () => {
			const store = createTestStore({
				flow: {
					modulesState: {},
					moduleOrder: ["A"],
					activeModuleId: "a",
					cookieConfirmResult: { isAccept: true },
					currencySwitchDialogOpen: false,
				},
				module: {
					byModuleId: { c: { selectedProduct: "prod-sample" } },
				},
			});
			expect(store.getState().flow.moduleOrder).toEqual(["A"]);
			expect(store.getState().flow.activeModuleId).toBe("a");
			expect(store.getState().flow.cookieConfirmResult).toEqual({
				isAccept: true,
			});
			expect(store.getState().module.byModuleId.c).toEqual({
				selectedProduct: "prod-sample",
			});
		});
	});
});
