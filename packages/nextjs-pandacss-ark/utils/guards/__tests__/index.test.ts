import { describe, expect, it } from "vitest";
import { isInteger, isNonEmptyArray, isString } from "@/utils/guards";

describe("isNonEmptyArray", () => {
	it("returns true for array with items", () => {
		expect(isNonEmptyArray([1])).toBe(true);
		expect(isNonEmptyArray([1, 2, 3])).toBe(true);
		expect(isNonEmptyArray(["a"])).toBe(true);
	});

	it("returns false for empty array", () => {
		expect(isNonEmptyArray([])).toBe(false);
	});

	it("returns false for non-array values", () => {
		expect(isNonEmptyArray(null)).toBe(false);
		expect(isNonEmptyArray(undefined)).toBe(false);
		expect(isNonEmptyArray(0)).toBe(false);
		expect(isNonEmptyArray("")).toBe(false);
		expect(isNonEmptyArray({ length: 1 })).toBe(false);
	});
});

describe("isString", () => {
	it("returns true for string primitives", () => {
		expect(isString("")).toBe(true);
		expect(isString("hello")).toBe(true);
	});

	it("returns false for non-string values", () => {
		expect(isString(0)).toBe(false);
		expect(isString(null)).toBe(false);
		expect(isString(undefined)).toBe(false);
		expect(isString(true)).toBe(false);
		expect(isString([])).toBe(false);
		expect(isString({})).toBe(false);
	});

	it("returns false for String object (boxed)", () => {
		expect(isString(Object("boxed"))).toBe(false);
	});
});

describe("isInteger", () => {
	it("returns true for integer numbers", () => {
		expect(isInteger(0)).toBe(true);
		expect(isInteger(1)).toBe(true);
		expect(isInteger(-1)).toBe(true);
		expect(isInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
		expect(isInteger(Number.MIN_SAFE_INTEGER)).toBe(true);
	});

	it("returns false for non-integer numbers", () => {
		expect(isInteger(1.5)).toBe(false);
		expect(isInteger(0.1)).toBe(false);
		expect(isInteger(NaN)).toBe(false);
		expect(isInteger(Infinity)).toBe(false);
		expect(isInteger(-Infinity)).toBe(false);
	});

	it("returns false for non-number values", () => {
		expect(isInteger("1")).toBe(false);
		expect(isInteger(null)).toBe(false);
		expect(isInteger(undefined)).toBe(false);
		expect(isInteger(true)).toBe(false);
		expect(isInteger([])).toBe(false);
	});
});
