import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it } from "vitest";
import { useFlow } from "@/core/flow/useFlow";
import type { AppStore } from "@/core/store";
import { createTestStore } from "@/core/store";

let store: AppStore;
beforeEach(() => {
	store = createTestStore();
});

function createWrapper() {
	return function Wrapper({ children }: { children: ReactNode }) {
		return <Provider store={store}>{children}</Provider>;
	};
}

describe("useFlow", () => {
	describe("initial state", () => {
		it("returns activeModuleId null and empty modulesState", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});
			expect(result.current.activeModuleId).toBeNull();
			expect(result.current.modulesState).toEqual({});
			expect(result.current.isModuleActive("A")).toBe(false);
		});

		it("returns showCookieConfirm true (not chosen) and currencySwitchDialogOpen false", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});
			expect(result.current.cookieConfirmResult).toEqual({ isAccept: null });
			expect(result.current.showCookieConfirm).toBe(true);
			expect(result.current.currencySwitchDialogOpen).toBe(false);
		});
	});

	describe("setModuleState", () => {
		it("updates modulesState and sets activeModuleId to that module's panel id", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result.current.setModuleState({
					name: "A",
					state: "PROCESSING",
					message: "Loading",
				});
			});

			expect(result.current.modulesState.A).toMatchObject({
				name: "A",
				state: "PROCESSING",
				message: "Loading",
			});
			expect(result.current.activeModuleId).toBe("a");
			expect(result.current.isModuleActive("A")).toBe(true);
		});

		it("when current active is COMPLETED, next module becomes active", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result.current.setModuleState({
					name: "A",
					state: "COMPLETED",
					message: "Done",
				});
			});
			expect(result.current.activeModuleId).toBeNull();

			act(() => {
				result.current.setModuleState({
					name: "B1",
					state: "PROCESSING",
					message: "Loading B1",
				});
			});
			expect(result.current.activeModuleId).toBe("b-1");
			expect(result.current.isModuleActive("B1")).toBe(true);
		});

		it("when all modules COMPLETED, activeModuleId is null", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result.current.setModuleState({
					name: "A",
					state: "COMPLETED",
					message: "Done",
				});
			});
			act(() => {
				result.current.setModuleState({
					name: "B1",
					state: "COMPLETED",
					message: "Done",
				});
			});
			expect(result.current.activeModuleId).toBeNull();
		});

		it("B2 is independent: setModuleState B2 activates b-2 panel", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result.current.setModuleState({
					name: "B2",
					state: "PROCESSING",
					message: "Loading B2",
				});
			});
			expect(result.current.activeModuleId).toBe("b-2");
			expect(result.current.isModuleActive("B2")).toBe(true);
		});
	});

	describe("setActiveModuleId", () => {
		it("sets activeModuleId so accordion can be controlled by user", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result.current.setActiveModuleId("c");
			});
			expect(result.current.activeModuleId).toBe("c");
			expect(result.current.isModuleActive("C")).toBe(true);

			act(() => {
				result.current.setActiveModuleId(null);
			});
			expect(result.current.activeModuleId).toBeNull();
		});

		it("allows activating b-2 so that panel opens (not only b-1)", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result.current.setActiveModuleId("b-2");
			});
			expect(result.current.activeModuleId).toBe("b-2");
		});
	});

	describe("cookie confirm dialog", () => {
		it("showCookieConfirm is true only when isAccept is null; both accept and decline close the dialog", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});
			expect(result.current.showCookieConfirm).toBe(true);
			expect(result.current.cookieConfirmResult.isAccept).toBeNull();

			act(() => {
				result.current.setCookieConfirm(true);
			});
			expect(result.current.cookieConfirmResult).toEqual({ isAccept: true });
			expect(result.current.showCookieConfirm).toBe(false);

			act(() => {
				result.current.setCookieConfirm(false);
			});
			expect(result.current.cookieConfirmResult).toEqual({ isAccept: false });
			expect(result.current.showCookieConfirm).toBe(false);
		});
	});

	describe("currency switch dialog", () => {
		it("setCurrencySwitchDialogOpen opens and closes dialog", () => {
			const { result } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});
			expect(result.current.currencySwitchDialogOpen).toBe(false);

			act(() => {
				result.current.setCurrencySwitchDialogOpen(true);
			});
			expect(result.current.currencySwitchDialogOpen).toBe(true);

			act(() => {
				result.current.setCurrencySwitchDialogOpen(false);
			});
			expect(result.current.currencySwitchDialogOpen).toBe(false);
		});
	});

	describe("modulesState subscription", () => {
		it("all useFlow() instances see the same modulesState and activeModuleId", () => {
			const { result: result1 } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});
			const { result: result2 } = renderHook(() => useFlow(), {
				wrapper: createWrapper(),
			});

			act(() => {
				result1.current.setModuleState({
					name: "A",
					state: "PROCESSING",
					message: "Loading",
				});
			});

			expect(result1.current.modulesState.A).toMatchObject({
				name: "A",
				state: "PROCESSING",
				message: "Loading",
			});
			expect(result2.current.modulesState.A).toMatchObject({
				name: "A",
				state: "PROCESSING",
				message: "Loading",
			});
			expect(result1.current.activeModuleId).toBe("a");
			expect(result2.current.activeModuleId).toBe("a");
		});
	});
});
