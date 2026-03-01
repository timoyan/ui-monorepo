import { createSlice } from "@reduxjs/toolkit";

/**
 * Per-module UI state for module C (e.g. cart/checkout).
 */
export type ModuleCState = {
	selectedProduct: string;
	busyItemIds: string[];
};

const initialState: ModuleCState = {
	selectedProduct: "",
	busyItemIds: [],
};

export const moduleCSlice = createSlice({
	name: "moduleC",
	initialState,
	reducers: {
		/** Merge payload into module C state. */
		setModuleCState(state, action: { payload: Partial<ModuleCState> }) {
			if (action.payload.selectedProduct !== undefined) {
				state.selectedProduct = action.payload.selectedProduct;
			}
			if (action.payload.busyItemIds !== undefined) {
				state.busyItemIds = action.payload.busyItemIds;
			}
		},
		/** Clear all module C UI state. */
		clearModuleCState() {
			return initialState;
		},
	},
});

export const { setModuleCState, clearModuleCState } = moduleCSlice.actions;
