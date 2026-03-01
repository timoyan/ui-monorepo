/**
 * Types for the module slice (per-module Ui state in Redux).
 * ModuleId matches the Ui panel ids used by flow (activeModuleId).
 */

/** Ui module id; must match flow's activeModuleId / MODULE_NAME_TO_Id. */
export type ModuleId = "a" | "b-1" | "b-2" | "c";

/**
 * Per-module Ui state. Each module can store arbitrary serializable key-value state.
 * Keep values JSON-serializable for Redux and optional hydration.
 */
export type ModuleUiState = Record<string, unknown>;

/** State keyed by module id. Sparse (only present modules). */
export type ModuleStateByModuleId = Partial<Record<ModuleId, ModuleUiState>>;
