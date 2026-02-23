import { render, type RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import type { ReactElement } from "react";
import type { AppStore, DeepPartial, RootState } from "@/core/store";
import { createTestStore } from "@/core/store";

export interface CreateReduxRenderOptions {
	/** Deep partial initial state (only the branches you need, e.g. one API query). */
	preloadedState?: DeepPartial<RootState>;
}

/**
 * Creates a Redux store and a render function that wraps UI with the store's Provider.
 * Use in tests that need a Redux-backed render. Reset API state in beforeEach if needed:
 * `beforeEach(() => store.dispatch(apiSlice.util.resetApiState()))`.
 *
 * @param options.preloadedState - Optional partial state to seed the store (e.g. prefilled cart from API slice).
 */
export function createReduxRender(options?: CreateReduxRenderOptions): {
	store: AppStore;
	renderWithStore: (ui: ReactElement) => RenderResult;
} {
	const store = createTestStore(options?.preloadedState);
	return {
		store,
		renderWithStore(ui: ReactElement) {
			return render(<Provider store={store}>{ui}</Provider>);
		},
	};
}
