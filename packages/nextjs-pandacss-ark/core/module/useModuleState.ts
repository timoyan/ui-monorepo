import { useCallback } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
	clearModuleUiState as clearModuleUiStateAction,
	setModuleUiState as setModuleUiStateAction,
} from "@/core/module/moduleSlice";
import type { ModuleId, ModuleUiState } from "@/core/module/types";
import type { RootState } from "@/core/store";
import { useAppDispatch } from "@/core/store";

/**
 * Select Ui state for one module from Redux.
 */
export function selectModuleUiState(moduleId: ModuleId) {
	return (state: RootState): ModuleUiState =>
		state.module.byModuleId[moduleId] ?? {};
}

/**
 * Hook to read and update a single module's Ui state in Redux.
 *
 * @param moduleId Module id (a | b-1 | b-2 | c)
 * @returns [state, setState, clearState] — current state object, merge updater, and clear function
 */
export function useModuleState(moduleId: ModuleId) {
	const dispatch = useAppDispatch();
	const state = useSelector(selectModuleUiState(moduleId), shallowEqual);

	const setState = useCallback(
		(next: ModuleUiState) => {
			dispatch(setModuleUiStateAction({ moduleId, state: next }));
		},
		[dispatch, moduleId],
	);

	const clearState = useCallback(() => {
		dispatch(clearModuleUiStateAction(moduleId));
	}, [dispatch, moduleId]);

	return [state, setState, clearState] as const;
}
