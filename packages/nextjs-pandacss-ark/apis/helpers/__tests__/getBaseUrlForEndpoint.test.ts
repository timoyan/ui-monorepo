import { afterEach, describe, expect, it, vi } from "vitest";
import {
	CART_ENDPOINTS,
	getBaseUrlForEndpoint,
	getCartApiOrigin,
} from "@/apis/helpers/getBaseUrlForEndpoint";

const CART_BASE_URL_HTTP = "http://test.com/api";
const CART_BASE_URL_HTTPS = "https://test.com/api";
const DEFAULT_BASE_URL = "/api";

describe("getCartApiOrigin", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns https origin when window.location.protocol is https:", () => {
		vi.stubGlobal("window", {
			location: { protocol: "https:" },
		});
		expect(getCartApiOrigin()).toBe("https://test.com");
	});

	it("returns http origin when window.location.protocol is http:", () => {
		vi.stubGlobal("window", {
			location: { protocol: "http:" },
		});
		expect(getCartApiOrigin()).toBe("http://test.com");
	});

	it("returns http origin when window is undefined", () => {
		vi.stubGlobal("window", undefined);
		expect(getCartApiOrigin()).toBe("http://test.com");
	});

	it("returns http origin when window.location is undefined", () => {
		vi.stubGlobal("window", { location: undefined });
		expect(getCartApiOrigin()).toBe("http://test.com");
	});
});

describe("getBaseUrlForEndpoint", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns cart base URL (http) for getCart when protocol is not https", () => {
		vi.stubGlobal("window", { location: { protocol: "http:" } });
		expect(getBaseUrlForEndpoint("getCart")).toBe(CART_BASE_URL_HTTP);
	});

	it("returns cart base URL (https) for getCart when protocol is https", () => {
		vi.stubGlobal("window", { location: { protocol: "https:" } });
		expect(getBaseUrlForEndpoint("getCart")).toBe(CART_BASE_URL_HTTPS);
	});

	it("returns CART_BASE_URL for all cart endpoints in Node (no window)", () => {
		vi.stubGlobal("window", undefined);
		for (const endpoint of CART_ENDPOINTS) {
			expect(getBaseUrlForEndpoint(endpoint)).toBe(CART_BASE_URL_HTTP);
		}
	});

	it("returns DEFAULT_BASE_URL for unknown endpoint", () => {
		expect(getBaseUrlForEndpoint("unknown")).toBe(DEFAULT_BASE_URL);
		expect(getBaseUrlForEndpoint("getUser")).toBe(DEFAULT_BASE_URL);
	});

	it("returns DEFAULT_BASE_URL when endpoint is undefined", () => {
		expect(getBaseUrlForEndpoint(undefined)).toBe(DEFAULT_BASE_URL);
	});

	it("returns DEFAULT_BASE_URL when endpoint is empty string", () => {
		expect(getBaseUrlForEndpoint("")).toBe(DEFAULT_BASE_URL);
	});
});
