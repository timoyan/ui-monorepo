import { beforeEach, describe, expect, it } from "vitest";
import {
	flowSlice,
	initCookieConfirmFromStorage,
	initModulesState,
	setCookieConfirmResult,
	setCurrencySwitchDialogOpen,
	setActiveModuleId,
	setModuleState,
} from "@/core/flow/flowSlice";

describe("flowSlice", () => {
	beforeEach(() => {
		// Reducer is pure; no shared state between tests
	});

	describe("initModulesState", () => {
		it("sets modules and order from payload", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {
						A: { name: "A", state: "INIT", message: "Step A" },
						C: { name: "C", state: "INIT", message: "Step C" },
					},
					order: ["A", "C"],
				}),
			);
			expect(state.moduleOrder).toEqual(["A", "C"]);
			expect(Object.keys(state.modulesState)).toEqual(["A", "C"]);
			expect(state.modulesState.A?.name).toBe("A");
			expect(state.modulesState.A?.state).toBe("INIT");
			expect(state.modulesState.C?.message).toBe("Step C");
			expect(state.activeModuleId).toBe("a");
		});

		it("uses default module order when order is omitted", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {
						B1: { name: "B1", state: "INIT", message: "B1" },
					},
				}),
			);
			expect(state.moduleOrder).toEqual(["A", "B1", "B2", "C"]);
			expect(state.modulesState.B1).toBeDefined();
		});

		it("when first module is COMPLETED, next module becomes active", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {
						A: { name: "A", state: "COMPLETED", message: "Done" },
						B1: { name: "B1", state: "INIT", message: "B1" },
					},
					order: ["A", "B1"],
				}),
			);
			expect(state.activeModuleId).toBe("b-1");
		});

		it("when all modules are COMPLETED, activeModuleId is null", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {
						A: { name: "A", state: "COMPLETED", message: "Done" },
						B1: { name: "B1", state: "COMPLETED", message: "Done" },
					},
					order: ["A", "B1"],
				}),
			);
			expect(state.activeModuleId).toBeNull();
		});

		it("when modules is empty but order is set, activeModuleId is null (no existing modules)", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {},
					order: ["A", "B1"],
				}),
			);
			expect(state.moduleOrder).toEqual(["A", "B1"]);
			expect(Object.keys(state.modulesState)).toHaveLength(0);
			expect(state.activeModuleId).toBeNull();
		});
	});

	describe("setModuleState", () => {
		it("merges payload into existing module and updates timestamp", () => {
			let state = flowSlice.reducer(
				undefined,
				setModuleState({
					name: "A",
					state: "INIT",
					message: "Initial",
				}),
			);
			const firstTs = state.modulesState.A?.timestamp;
			state = flowSlice.reducer(
				state,
				setModuleState({
					name: "A",
					state: "PROCESSING",
					message: "Loading",
				}),
			);
			expect(state.modulesState.A?.state).toBe("PROCESSING");
			expect(state.modulesState.A?.message).toBe("Loading");
			expect(state.modulesState.A?.timestamp).toBeGreaterThanOrEqual(
				firstTs ?? 0,
			);
		});

		it("when A is COMPLETED and B1 is FAILED, activeModuleId is b-1 (next active)", () => {
			let state = flowSlice.reducer(
				undefined,
				setModuleState({
					name: "A",
					state: "COMPLETED",
					message: "Done",
				}),
			);
			state = flowSlice.reducer(
				state,
				setModuleState({
					name: "B1",
					state: "FAILED",
					message: "Error",
				}),
			);
			expect(state.activeModuleId).toBe("b-1");
		});

		it("when both A and B1 exist, activeModuleId is first in order (A)", () => {
			let state = flowSlice.reducer(
				undefined,
				setModuleState({
					name: "A",
					state: "INIT",
					message: "A",
				}),
			);
			state = flowSlice.reducer(
				state,
				setModuleState({
					name: "B1",
					state: "PROCESSING",
					message: "B1",
				}),
			);
			expect(state.activeModuleId).toBe("a");
		});

		it("when cur has lower priority than acc (cmp > 0), active remains acc", () => {
			let state = flowSlice.reducer(
				undefined,
				setModuleState({
					name: "A",
					state: "PROCESSING",
					message: "A",
				}),
			);
			state = flowSlice.reducer(
				state,
				setModuleState({
					name: "B1",
					state: "INIT",
					message: "B1",
				}),
			);
			expect(state.activeModuleId).toBe("a");
		});

		it("when A is COMPLETED, activeModuleId is first incomplete (B1)", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {
						A: { name: "A", state: "COMPLETED", message: "Done" },
						B1: { name: "B1", state: "INIT", message: "B1" },
						B2: { name: "B2", state: "INIT", message: "B2" },
					},
					order: ["A", "B1", "B2"],
				}),
			);
			expect(state.activeModuleId).toBe("b-1");
		});

		it("when only one module in order and it is COMPLETED, activeModuleId is null", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {
						A: { name: "A", state: "COMPLETED", message: "Done" },
					},
					order: ["A"],
				}),
			);
			expect(state.activeModuleId).toBeNull();
		});

		it("when only one module in order and it is not COMPLETED, activeModuleId is that module", () => {
			const state = flowSlice.reducer(
				undefined,
				initModulesState({
					modules: {
						A: { name: "A", state: "INIT", message: "A" },
					},
					order: ["A"],
				}),
			);
			expect(state.activeModuleId).toBe("a");
		});
	});

	describe("setActiveModuleId", () => {
		it("sets activeModuleId to payload", () => {
			const state = flowSlice.reducer(undefined, setActiveModuleId("b-2"));
			expect(state.activeModuleId).toBe("b-2");
		});

		it("allows null to clear active", () => {
			let state = flowSlice.reducer(undefined, setActiveModuleId("a"));
			state = flowSlice.reducer(state, setActiveModuleId(null));
			expect(state.activeModuleId).toBeNull();
		});
	});

	describe("cookie confirm", () => {
		it("setCookieConfirmResult updates cookieConfirmResult", () => {
			const state = flowSlice.reducer(
				undefined,
				setCookieConfirmResult({ isAccept: true }),
			);
			expect(state.cookieConfirmResult).toEqual({ isAccept: true });
		});

		it("initCookieConfirmFromStorage updates cookieConfirmResult", () => {
			const state = flowSlice.reducer(
				undefined,
				initCookieConfirmFromStorage({ isAccept: false }),
			);
			expect(state.cookieConfirmResult).toEqual({ isAccept: false });
		});
	});

	describe("currency switch dialog", () => {
		it("setCurrencySwitchDialogOpen sets open state", () => {
			let state = flowSlice.reducer(
				undefined,
				setCurrencySwitchDialogOpen(true),
			);
			expect(state.currencySwitchDialogOpen).toBe(true);
			state = flowSlice.reducer(state, setCurrencySwitchDialogOpen(false));
			expect(state.currencySwitchDialogOpen).toBe(false);
		});
	});
});
