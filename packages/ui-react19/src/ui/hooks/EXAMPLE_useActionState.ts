/**
 * Example hook demonstrating React 19 version requirements documentation.
 *
 * This is an EXAMPLE file showing how to document version requirements.
 * Delete this file or use it as a template for actual hooks.
 *
 * @fileoverview Example React 19 hook with version documentation
 * @package ui-react19
 * @requires React 19.0.0 or higher
 */

import { useActionState } from "react";

/**
 * Custom hook that uses React 19's `useActionState` feature.
 *
 * **Version Requirements:**
 * - Requires React 19.0.0 or higher
 * - This hook is only available in `ui-react19` package
 * - Do not use in React 18 projects (use `ui-react18` instead)
 *
 * **Peer Dependencies:**
 * ```json
 * {
 *   "peerDependencies": {
 *     "react": ">=19.0.0",
 *     "react-dom": ">=19.0.0"
 *   }
 * }
 * ```
 *
 * @template TState - The type of the state
 * @template TFormData - The type of the form data
 *
 * @param action - The async action function
 * @param initialState - The initial state value
 *
 * @returns A tuple containing [state, action, isPending]
 *
 * @example
 * ```tsx
 * import { useMyActionState } from 'ui-react19/hooks';
 *
 * async function submitForm(prevState: number, formData: FormData) {
 *   // Your async logic here
 *   return prevState + 1;
 * }
 *
 * function MyComponent() {
 *   const [state, submitAction, isPending] = useMyActionState(
 *     submitForm,
 *     0
 *   );
 *
 *   return (
 *     <form action={submitAction}>
 *       <button disabled={isPending}>
 *         {isPending ? 'Submitting...' : 'Submit'}
 *       </button>
 *       <p>Count: {state}</p>
 *     </form>
 *   );
 * }
 * ```
 *
 * @throws {Error} If used with React version < 19.0.0
 *
 * @see {@link https://react.dev/reference/react/useActionState} React 19 useActionState documentation
 *
 * @since 1.0.0
 * @package ui-react19
 */
export function useMyActionState<TState, TFormData extends FormData = FormData>(
	action: (
		state: Awaited<TState>,
		payload: TFormData,
	) => TState | Promise<TState>,
	initialState: Awaited<TState>,
): [
	state: Awaited<TState>,
	dispatch: (payload: TFormData) => void,
	isPending: boolean,
] {
	// React 19's useActionState hook
	const [state, formAction, isPending] = useActionState<TState, TFormData>(
		action,
		initialState,
	);

	return [state, formAction, isPending];
}

/**
 * Type guard to check if React 19 features are available.
 *
 * Use this to provide runtime checks if needed.
 *
 * @returns true if React 19 is available, false otherwise
 *
 * @example
 * ```tsx
 * if (isReact19Available()) {
 *   // Use React 19 features
 * } else {
 *   // Fallback to React 18
 * }
 * ```
 */
export function isReact19Available(): boolean {
	try {
		// Check React version
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		// @ts-expect-error - require is available at runtime in Node.js
		const reactVersion = (require("react") as { version?: string }).version;
		if (!reactVersion) return false;

		const majorVersion = Number.parseInt(reactVersion.split(".")[0] || "0", 10);
		return majorVersion >= 19;
	} catch {
		return false;
	}
}
