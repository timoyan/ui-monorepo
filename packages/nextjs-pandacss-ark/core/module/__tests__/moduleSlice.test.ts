import { describe, expect, it } from "vitest";
import {
	clearModuleUiState,
	moduleSlice,
	setModuleUiState,
} from "@/core/module/moduleSlice";

describe("moduleSlice", () => {
	it("has initial byModuleId empty", () => {
		const state = moduleSlice.reducer(undefined, { type: "unknown" });
		expect(state.byModuleId).toEqual({});
	});

	it("setModuleUiState merges payload into module state", () => {
		let state = moduleSlice.reducer(
			undefined,
			setModuleUiState({ moduleId: "c", state: { selectedProduct: "p1" } }),
		);
		expect(state.byModuleId.c).toEqual({ selectedProduct: "p1" });

		state = moduleSlice.reducer(
			state,
			setModuleUiState({ moduleId: "c", state: { busyItemIds: ["id1"] } }),
		);
		expect(state.byModuleId.c).toEqual({
			selectedProduct: "p1",
			busyItemIds: ["id1"],
		});
	});

	it("clearModuleUiState removes module entry", () => {
		let state = moduleSlice.reducer(
			undefined,
			setModuleUiState({ moduleId: "a", state: { foo: 1 } }),
		);
		expect(state.byModuleId.a).toEqual({ foo: 1 });

		state = moduleSlice.reducer(state, clearModuleUiState("a"));
		expect(state.byModuleId.a).toBeUndefined();
	});
});
