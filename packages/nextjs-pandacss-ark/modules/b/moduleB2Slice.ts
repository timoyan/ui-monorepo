import { createSlice } from "@reduxjs/toolkit";

/**
 * Per-module UI state for module B2.
 * Kept minimal; extend when module B2 needs Redux state.
 */
export type ModuleB2State = Record<string, unknown>;

const initialState: ModuleB2State = {};

export const moduleB2Slice = createSlice({
	name: "moduleB2",
	initialState,
	reducers: {
		/** Merge payload into module B2 state. */
		setModuleB2State(state, action: { payload: Partial<ModuleB2State> }) {
			Object.assign(state, action.payload);
		},
		/** Clear all module B2 UI state. */
		clearModuleB2State() {
			return initialState;
		},
	},
});

export const { setModuleB2State, clearModuleB2State } = moduleB2Slice.actions;
