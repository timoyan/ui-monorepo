import type { AnyAction } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/apis/apiSlice";
import { flowSlice } from "@/core/flow/flowSlice";
import { moduleASlice } from "@/modules/a/moduleASlice";
import { moduleB1Slice } from "@/modules/b/moduleB1Slice";
import { moduleB2Slice } from "@/modules/b/moduleB2Slice";
import { moduleCSlice } from "@/modules/c/moduleCSlice";
import { toastMiddleware } from "./toastMiddleware";

const combinedReducer = combineReducers({
	[apiSlice.reducerPath]: apiSlice.reducer,
	[flowSlice.name]: flowSlice.reducer,
	[moduleASlice.name]: moduleASlice.reducer,
	[moduleB1Slice.name]: moduleB1Slice.reducer,
	[moduleB2Slice.name]: moduleB2Slice.reducer,
	[moduleCSlice.name]: moduleCSlice.reducer,
});

const rootReducer = (
	state: ReturnType<typeof combinedReducer> | undefined,
	action: AnyAction,
) => {
	if (action.type === HYDRATE) {
		return { ...state, ...action.payload } as ReturnType<
			typeof combinedReducer
		>;
	}
	return combinedReducer(state, action);
};

export const makeStore = () =>
	configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(apiSlice.middleware, toastMiddleware),
	});

export const NextReduxWrapper = createWrapper(makeStore);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

/**
 * Typed dispatch hook. Use this instead of useDispatch<AppDispatch>() so callers
 * don't need to specify the generic.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Recursive partial: every key and nested key is optional. Use for preloadedState so only needed branches are passed. */
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Creates a store with optional preloaded state. For test use only (e.g. createReduxRender).
 * Use preloadedState to seed API cache or other slices without dispatching actions.
 * DeepPartial allows passing only the slice/keys you need (e.g. one query in the api slice).
 */
export function createTestStore(
	preloadedState?: DeepPartial<RootState>,
): AppStore {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(apiSlice.middleware, toastMiddleware),
		// configureStore infers incompatible types when preloadedState is Partial; cast for test store.
	} as Parameters<typeof configureStore>[0]) as AppStore;
}
