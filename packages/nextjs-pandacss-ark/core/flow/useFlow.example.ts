/**
 * useFlow usage examples
 *
 * modulesState comes from Redux (single source of truth); setModuleState adds or updates a module by name.
 */
/** biome-ignore-all lint/correctness/noUnusedVariables: Example file - variables are intentionally unused for demonstration purposes */

import { useFlow } from "./useFlow";

// ===== Example 1: Read modulesState =====
export function Example1() {
	const { modulesState } = useFlow();
	// modulesState is keyed by module name; each entry has name, state, message?, data?, timestamp.
	// e.g. modulesState.A?.state === "PROCESSING"
}

// ===== Example 2: setModuleState — add or update one module =====
export function Example2() {
	const { setModuleState } = useFlow();
	// Add or update module "A":
	// setModuleState({ name: "A", state: "PROCESSING", message: "Loading..." });
	// If "A" exists, fields are merged and timestamp updated; otherwise added.
}

// ===== Example 3: Pass setModuleState to modules via context =====
export function Example3() {
	const { setModuleState, modulesState } = useFlow();
	// Provide setModuleState in React context. A module on "Checkout" click does:
	// setModuleState({ name: "C", state: "PROCESSING", message: "Loading cart..." });
}

// ===== Example 4: Drive UI from modulesState =====
export function Example4() {
	const { modulesState } = useFlow();
	const moduleA = modulesState.A;
	// if (moduleA?.state === "PROCESSING") showSpinner();
	// if (moduleA?.state === "FAILED") showError(moduleA.message);
}

// ===== Example 5: activeModuleId — subscribe to control accordion =====
export function Example5() {
	const { activeModuleId, setActiveModuleId, isModuleActive } = useFlow();
	// activeModuleId is in Redux (a | b-1 | b-2 | c or null when all COMPLETED). Page subscribes and passes value={activeModuleId === moduleId ? ["module-content"] : []} to ModuleContainer.
	// onValueChange: setActiveModuleId(moduleId) or setActiveModuleId(null). isModuleActive("A") for ModuleName-based check.
}
