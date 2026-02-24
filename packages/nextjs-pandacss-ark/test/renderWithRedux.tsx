import { render, type RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactElement } from "react";
import type { AppStore, DeepPartial, RootState } from "@/core/store";
import { createTestStore } from "@/core/store";

export interface RenderWithStoreOptions {
	/** Deep partial initial state for this render (e.g. prefilled cart from API slice). */
	preloadedState?: DeepPartial<RootState>;
}

export type RenderResultWithStore = RenderResult & { store: AppStore };

/**
 * Renders UI with a Redux Provider. Creates a new store per call (optionally with preloadedState).
 * Use when you need a Redux-backed render and/or want to pass preloadedState per test.
 *
 * @param ui - React element to render
 * @param options.preloadedState - Optional partial state to seed the store for this render
 * @returns RTL render result plus `store` (the store used for this render)
 */
export function renderWithStore(
	ui: ReactElement,
	options?: RenderWithStoreOptions,
): RenderResultWithStore {
	const store = createTestStore(options?.preloadedState);
	const result = render(<Provider store={store}>{ui}</Provider>);
	return { ...result, store };
}

export interface CreateReduxRenderOptions {
	/** Deep partial initial state for the shared store (used when renderWithStore is called without options). */
	preloadedState?: DeepPartial<RootState>;
}

/**
 * Creates a shared Redux store and a render function that uses it.
 * Use when many tests in the same file share one store and you don't need different preloadedState per test.
 * For per-call preloadedState, use the standalone `renderWithStore(ui, { preloadedState })` instead.
 *
 * @param options.preloadedState - Optional partial state to seed the shared store
 */
export function createReduxRender(options?: CreateReduxRenderOptions): {
	store: AppStore;
	renderWithStore: (
		ui: ReactElement,
		callOptions?: RenderWithStoreOptions,
	) => RenderResultWithStore;
} {
	const store = createTestStore(options?.preloadedState);
	return {
		store,
		renderWithStore(ui: ReactElement, callOptions?: RenderWithStoreOptions) {
			const storeToUse =
				callOptions?.preloadedState !== undefined
					? createTestStore(callOptions.preloadedState)
					: store;
			const result = render(<Provider store={storeToUse}>{ui}</Provider>);
			return { ...result, store: storeToUse };
		},
	};
}
