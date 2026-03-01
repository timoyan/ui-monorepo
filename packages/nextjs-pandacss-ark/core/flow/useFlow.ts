import { useCallback, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { MODULE_NAME_TO_ID } from "@/core/constants/module";
import {
	getCookieConfirmFromStorage,
	setCookieConfirmInStorage,
} from "@/core/flow/cookieConfirmStorage";
import {
	initCookieConfirmFromStorage as initCookieConfirmFromStorageAction,
	setActiveModuleId as setActiveModuleIdAction,
	setCookieConfirmResult as setCookieConfirmResultAction,
	setCurrencySwitchDialogOpen as setCurrencySwitchDialogOpenAction,
	setModuleState as setModuleStateAction,
} from "@/core/flow/flowSlice";
import type { ModuleName, ModuleStatePayload } from "@/core/flow/types";
import type { RootState } from "@/core/store";
import { useAppDispatch } from "@/core/store";

interface UseFlowOptions {
	/** Reserved for future use (e.g. initial open module Id). */
	initialOpenModuleId?: string | null;
}

/**
 * Hook for global user flow: per-module state (Redux) and updater.
 *
 * **modulesState** and **activeModuleId** are read from Redux. When a
 * component uses useFlow(), it subscribes to the flow slice; when
 * setModuleState is dispatched, the reducer updates modulesState and
 * recomputes activeModuleId, so subscribed components re-render.
 *
 * **activeModuleId** is the Ui panel id (a | b-1 | b-2 | c) that is active.
 * Use it to pass value/onValueChange to ModuleContainer so accordion open/close is driven by Redux.
 * When all modules are COMPLETED, activeModuleId is null.
 *
 * @param options Configuration options (initialOpenModuleId reserved)
 * @returns modulesState, setModuleState, activeModuleId, setActiveModuleId, isModuleActive
 */
function selectFlowState(state: RootState) {
	return {
		modulesState: state.flow.modulesState,
		moduleOrder: state.flow.moduleOrder,
		activeModuleId: state.flow.activeModuleId,
		cookieConfirmResult: state.flow.cookieConfirmResult,
		currencySwitchDialogOpen: state.flow.currencySwitchDialogOpen,
	};
}

export function useFlow(_options?: UseFlowOptions) {
	const {
		modulesState,
		moduleOrder,
		activeModuleId,
		cookieConfirmResult,
		currencySwitchDialogOpen,
	} = useSelector(selectFlowState, shallowEqual);
	const dispatch = useAppDispatch();

	/** Sync cookie consent from sessionStorage on mount (client-only). Call once from the component that renders the cookie dialog. */
	useEffect(() => {
		const stored = getCookieConfirmFromStorage();
		if (stored !== null) {
			dispatch(initCookieConfirmFromStorageAction({ isAccept: stored }));
		}
	}, [dispatch]);

	const setModuleState = useCallback(
		(payload: ModuleStatePayload) => {
			dispatch(setModuleStateAction(payload));
		},
		[dispatch],
	);

	const setActiveModuleId = useCallback(
		(moduleId: string | null) => {
			dispatch(setActiveModuleIdAction(moduleId));
		},
		[dispatch],
	);

	/** Accept (true) or decline (false) cookie consent; persists to sessionStorage and closes dialog. */
	const setCookieConfirm = useCallback(
		(accepted: boolean) => {
			setCookieConfirmInStorage(accepted);
			dispatch(setCookieConfirmResultAction({ isAccept: accepted }));
		},
		[dispatch],
	);

	const setCurrencySwitchDialogOpen = useCallback(
		(open: boolean) => {
			dispatch(setCurrencySwitchDialogOpenAction(open));
		},
		[dispatch],
	);

	/** Whether this module (by ModuleName) is active. Subscribes via Redux. */
	const isModuleActive = useCallback(
		(name: ModuleName): boolean => {
			return activeModuleId === MODULE_NAME_TO_ID[name];
		},
		[activeModuleId],
	);

	return {
		modulesState,
		setModuleState,
		/** Order of modules for this request (set by initModulesState on SSR). Use to render panels in flow order. */
		moduleOrder,
		/** Current active panel (Ui moduleId: a | b-1 | b-2 | c). Recomputed on setModuleState. No active when all COMPLETED. */
		activeModuleId,
		/** Set active panel (e.g. when user toggles accordion). */
		setActiveModuleId,
		isModuleActive,
		/** Cookie consent: { isAccept: true | false | null }. null = not chosen (show dialog); true = accepted; false = declined. */
		cookieConfirmResult,
		/** True when cookie dialog should be shown (user has not chosen yet, i.e. isAccept === null). Accept and decline both close the dialog. */
		showCookieConfirm: cookieConfirmResult.isAccept === null,
		/** Set cookie consent and persist to sessionStorage; closes dialog. */
		setCookieConfirm,
		/** Currency switch dialog open (computed from user operations). */
		currencySwitchDialogOpen,
		/** Open or close currency switch dialog. */
		setCurrencySwitchDialogOpen,
	};
}
