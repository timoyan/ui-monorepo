import { createSlice } from "@reduxjs/toolkit";

/**
 * Per-module UI state for module A.
 * Kept minimal; extend when module A needs Redux state.
 */
export type ModuleAState = Record<string, unknown>;

const initialState: ModuleAState = {};

export const moduleASlice = createSlice({
	name: "moduleA",
	initialState,
	reducers: {
		/** Merge payload into module A state. */
		setModuleAState(state, action: { payload: Partial<ModuleAState> }) {
			Object.assign(state, action.payload);
		},
		/** Clear all module A UI state. */
		clearModuleAState() {
			return initialState;
		},
	},
});

export const { setModuleAState, clearModuleAState } = moduleASlice.actions;
