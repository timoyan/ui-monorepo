import type { ModuleName } from "@/core/constants/module";

/**
 * Flow types shared by useFlow and the Redux flow slice.
 * Keep here to avoid circular imports (store → flowSlice → useFlow → store).
 */

/**
 * Data shape for one module. Modules/page pass this to drive flow (state, message, etc.).
 */
export interface ModuleStatePayload {
	name: ModuleName;
	state: "INIT" | "PROCESSING" | "COMPLETED" | "FAILED";
	message?: string;
	data?: unknown;
}

export interface ModuleState extends ModuleStatePayload {
	timestamp: number;
}

/** Re-export for consumers that only need the type. */
export type { ModuleName } from "@/core/constants/module";

/**
 * State for multiple modules keyed by module name.
 * Plain object for JSON-serializability and Redux. Sparse (Partial).
 */
export type ModulesState = Partial<Record<ModuleName, ModuleState>>;

/**
 * Payload for initModulesState. Supply which modules to init and optional order.
 * Order is used for flow progression (activate next after COMPLETED; no active when all COMPLETED) and for listing.
 * If order is omitted, default order [A, B1, B2, C] is used.
 */
export interface InitModulesStatePayload {
	/** Modules to init; only these keys are set. */
	modules: Partial<Record<ModuleName, ModuleStatePayload>>;
	/** Order of modules for this request (e.g. from getServerSideProps context). */
	order?: ModuleName[];
}

/** Cookie consent result: isAccept null = user has not chosen (show dialog); true = accepted; false = declined. */
export interface CookieConfirmResult {
	isAccept: true | false | null;
}

/** Currency code for display/selection. */
export type CurrencyCode = string;
