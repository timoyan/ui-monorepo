/**
 * Single source of truth for module names and their UI panel ids.
 * Reuse these constants in flow slice, useFlow, pages, and getFlowInitFromRequest.
 */

/** Ordered list of module names (flow order and listing). */
export const MODULE_NAMES = ["A", "B1", "B2", "C"] as const;

/** Module name as used in flow state (setModuleState, initModulesState). */
export type ModuleName = (typeof MODULE_NAMES)[number];

/** Map from module name to UI panel id (activeModuleId, data-module, etc.). */
export const MODULE_NAME_TO_ID: Record<ModuleName, string> = {
	A: "a",
	B1: "b-1",
	B2: "b-2",
	C: "c",
} as const;

/** UI module id; must match flow activeModuleId and MODULE_NAME_TO_ID values. */
export type ModuleId = (typeof MODULE_NAME_TO_ID)[ModuleName];

/** Default module order when not set by initModulesState (e.g. client-only). */
export const DEFAULT_MODULE_ORDER: readonly ModuleName[] = MODULE_NAMES;
