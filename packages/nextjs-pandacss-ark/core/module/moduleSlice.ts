import { createSlice } from "@reduxjs/toolkit";
import type { ModuleId, ModuleUiState } from "@/core/module/types";

export const moduleSlice = createSlice({
	name: "module",
	initialState: {
		/** Per-module Ui state; keyed by module id (a | b-1 | b-2 | c). */
		byModuleId: {} as Partial<Record<ModuleId, ModuleUiState>>,
	},
	reducers: {
		/**
		 * Merge payload into the given module's Ui state.
		 * Creates the module entry if it does not exist.
		 */
		setModuleUiState(
			state,
			action: { payload: { moduleId: ModuleId; state: ModuleUiState } },
		) {
			const { moduleId, state: next } = action.payload;
			const current = state.byModuleId[moduleId] ?? {};
			state.byModuleId[moduleId] = { ...current, ...next };
		},
		/** Clear all Ui state for one module. */
		clearModuleUiState(state, action: { payload: ModuleId }) {
			delete state.byModuleId[action.payload];
		},
	},
});

export const { setModuleUiState, clearModuleUiState } = moduleSlice.actions;
