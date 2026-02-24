import { createSlice } from "@reduxjs/toolkit";
import type {
	CookieConfirmResult,
	InitModulesStatePayload,
	ModuleName,
	ModuleState,
	ModulesState,
	ModuleStatePayload,
} from "@/core/flow/types";

/** Default order when not set by initModulesState (e.g. client-only). */
const DEFAULT_MODULE_ORDER: ModuleName[] = ["A", "B1", "B2", "C"];

/** One UI moduleId per ModuleName (b-1 and b-2 are independent modules). */
const MODULE_NAME_TO_ID: Record<ModuleName, string> = {
	A: "a",
	B1: "b-1",
	B2: "b-2",
	C: "c",
};

/**
 * Computes which single module should be active from current modulesState.
 * Active = first module in order whose state is not COMPLETED.
 * When all modules are COMPLETED, there is no active module (returns null).
 * Returns UI moduleId (a | b-1 | b-2 | c) or null.
 */
function computeActiveModuleId(
	modulesState: ModulesState,
	moduleOrder: ModuleName[],
): string | null {
	const existing = moduleOrder.filter((n) => modulesState[n] != null);
	if (existing.length === 0) return null;
	const firstIncomplete = existing.find(
		(name) => (modulesState[name] as ModuleState).state !== "COMPLETED",
	);
	if (firstIncomplete == null) return null;
	return MODULE_NAME_TO_ID[firstIncomplete];
}

export const flowSlice = createSlice({
	name: "flow",
	initialState: {
		/** Single source of truth for all modules' data; keyed by module name. */
		modulesState: {} as ModulesState,
		/** Order of modules for this request (flow progression and listing). Set by initModulesState. */
		moduleOrder: DEFAULT_MODULE_ORDER,
		/** Which module panel is active (UI moduleId: a | b-1 | b-2 | c). Recomputed on setModuleState; set directly on user toggle. No active when all COMPLETED. */
		activeModuleId: null as string | null,
		/** Cookie consent: isAccept null = show dialog; true/false = user answered (persisted in sessionStorage). */
		cookieConfirmResult: { isAccept: null } as CookieConfirmResult,
		/** Currency switch dialog open. Computed from user operations; set true to show, false to close. */
		currencySwitchDialogOpen: false,
	},
	reducers: {
		/** If module exists, merge payload into it; otherwise add. Always set timestamp; then recompute activeModuleId. */
		setModuleState(state, action: { payload: ModuleStatePayload }) {
			const payload = action.payload;
			const existing = state.modulesState[payload.name];
			const now = Date.now();
			const next: ModuleState = existing
				? { ...existing, ...payload, timestamp: now }
				: { ...payload, timestamp: now };
			state.modulesState[payload.name] = next;
			state.activeModuleId = computeActiveModuleId(
				state.modulesState,
				state.moduleOrder,
			);
		},
		/**
		 * Set modules and optional order (e.g. SSR from request context). Each module gets the same timestamp;
		 * activeModuleId is recomputed. Only modules in payload.modules are set; order drives flow and listing.
		 */
		initModulesState(state, action: { payload: InitModulesStatePayload }) {
			const { modules, order } = action.payload;
			if (order !== undefined) {
				state.moduleOrder = order;
			}
			const now = Date.now();
			const namesToInit = order ?? (Object.keys(modules) as ModuleName[]);
			for (const name of namesToInit) {
				const payload = modules[name];
				if (payload) {
					state.modulesState[name] = { ...payload, timestamp: now };
				}
			}
			state.activeModuleId = computeActiveModuleId(
				state.modulesState,
				state.moduleOrder,
			);
		},
		/** Set active panel directly (e.g. when user toggles accordion). Payload: UI moduleId or null. */
		setActiveModuleId(state, action: { payload: string | null }) {
			state.activeModuleId = action.payload;
		},
		/** Set cookie consent result (call after persisting to sessionStorage on client). */
		setCookieConfirmResult(
			state,
			action: { payload: { isAccept: true } | { isAccept: false } },
		) {
			state.cookieConfirmResult = action.payload;
		},
		/** Sync cookie consent from sessionStorage on client mount. */
		initCookieConfirmFromStorage(
			state,
			action: { payload: { isAccept: true } | { isAccept: false } },
		) {
			state.cookieConfirmResult = action.payload;
		},
		/** Open or close currency switch dialog (driven by user operation state). */
		setCurrencySwitchDialogOpen(state, action: { payload: boolean }) {
			state.currencySwitchDialogOpen = action.payload;
		},
	},
});

export const {
	initModulesState,
	setModuleState,
	setActiveModuleId,
	setCookieConfirmResult,
	initCookieConfirmFromStorage,
	setCurrencySwitchDialogOpen,
} = flowSlice.actions;
