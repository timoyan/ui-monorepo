import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	getCookieConfirmFromStorage,
	setCookieConfirmInStorage,
} from "@/core/flow/cookieConfirmStorage";

describe("cookieConfirmStorage", () => {
	const originalWindow = globalThis.window;

	beforeEach(() => {
		vi.stubGlobal("sessionStorage", {
			getItem: vi.fn(),
			setItem: vi.fn(),
			removeItem: vi.fn(),
			clear: vi.fn(),
			length: 0,
			key: vi.fn(),
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	describe("getCookieConfirmFromStorage", () => {
		it("returns true when sessionStorage has 'true'", () => {
			vi.mocked(sessionStorage.getItem).mockReturnValue("true");
			expect(getCookieConfirmFromStorage()).toBe(true);
		});

		it("returns false when sessionStorage has 'false'", () => {
			vi.mocked(sessionStorage.getItem).mockReturnValue("false");
			expect(getCookieConfirmFromStorage()).toBe(false);
		});

		it("returns null when sessionStorage has other value or empty", () => {
			vi.mocked(sessionStorage.getItem).mockReturnValue("");
			expect(getCookieConfirmFromStorage()).toBeNull();
			vi.mocked(sessionStorage.getItem).mockReturnValue("1");
			expect(getCookieConfirmFromStorage()).toBeNull();
		});

		it("returns null when sessionStorage throws", () => {
			vi.mocked(sessionStorage.getItem).mockImplementation(() => {
				throw new Error("QuotaExceeded");
			});
			expect(getCookieConfirmFromStorage()).toBeNull();
		});
	});

	describe("setCookieConfirmInStorage", () => {
		it("calls setItem with key and string value", () => {
			setCookieConfirmInStorage(true);
			expect(sessionStorage.setItem).toHaveBeenCalledWith(
				"flow:cookieConfirm",
				"true",
			);
			vi.mocked(sessionStorage.setItem).mockClear();
			setCookieConfirmInStorage(false);
			expect(sessionStorage.setItem).toHaveBeenCalledWith(
				"flow:cookieConfirm",
				"false",
			);
		});

		it("does not throw when setItem throws", () => {
			vi.mocked(sessionStorage.setItem).mockImplementation(() => {
				throw new Error("QuotaExceeded");
			});
			expect(() => setCookieConfirmInStorage(true)).not.toThrow();
		});
	});

	describe("SSR (no window)", () => {
		beforeEach(() => {
			vi.stubGlobal("window", undefined);
		});

		afterEach(() => {
			vi.stubGlobal("window", originalWindow);
		});

		it("getCookieConfirmFromStorage returns null when window is undefined", () => {
			expect(getCookieConfirmFromStorage()).toBeNull();
		});

		it("setCookieConfirmInStorage does nothing when window is undefined", () => {
			setCookieConfirmInStorage(true);
			expect(sessionStorage.setItem).not.toHaveBeenCalled();
		});
	});
});
