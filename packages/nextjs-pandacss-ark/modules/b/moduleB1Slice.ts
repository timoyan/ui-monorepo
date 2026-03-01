import { createSlice } from "@reduxjs/toolkit";

/**
 * Per-module UI state for module B1.
 * Kept minimal; extend when module B1 needs Redux state.
 */
export type ModuleB1State = Record<string, unknown>;

const initialState: ModuleB1State = {};

export const moduleB1Slice = createSlice({
	name: "moduleB1",
	initialState,
	reducers: {
		/** Merge payload into module B1 state. */
		setModuleB1State(state, action: { payload: Partial<ModuleB1State> }) {
			Object.assign(state, action.payload);
		},
		/** Clear all module B1 UI state. */
		clearModuleB1State() {
			return initialState;
		},
	},
});

export const { setModuleB1State, clearModuleB1State } = moduleB1Slice.actions;
