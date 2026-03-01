import { describe, expect, it } from "vitest";
import { isValidProductCode } from "@/utils/products";

describe("isValidProductCode", () => {
	it("returns true for 10-char code starting with PROD-", () => {
		expect(isValidProductCode("PROD-12345")).toBe(true);
		expect(isValidProductCode("PROD-ABCDE")).toBe(true);
		expect(isValidProductCode("PROD-00000")).toBe(true);
	});

	it("returns false when length is not 10", () => {
		expect(isValidProductCode("PROD-1234")).toBe(false); // 9 chars
		expect(isValidProductCode("PROD-123456")).toBe(false); // 11 chars
		expect(isValidProductCode("PROD-")).toBe(false); // 5 chars
		expect(isValidProductCode("")).toBe(false);
	});

	it("returns false when prefix is not PROD-", () => {
		expect(isValidProductCode("prod-12345")).toBe(false);
		expect(isValidProductCode("PRED-12345")).toBe(false);
		expect(isValidProductCode("PROD12345")).toBe(false);
		expect(isValidProductCode("XPROD-1234")).toBe(false);
	});
});
