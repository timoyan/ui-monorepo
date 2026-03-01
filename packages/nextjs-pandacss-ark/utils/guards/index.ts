/**
 * Type guards and predicate helpers for runtime checks.
 */

/**
 * Returns true if value is an array with at least one element.
 */
export function isNonEmptyArray(value: unknown): value is unknown[] {
	return Array.isArray(value) && value.length > 0;
}

/**
 * Returns true if value is a string (primitive).
 */
export function isString(value: unknown): value is string {
	return typeof value === "string";
}

/**
 * Returns true if value is an integer number.
 * Uses Number.isInteger (excludes NaN, Infinity, and non-integer numbers).
 */
export function isInteger(value: unknown): value is number {
	return typeof value === "number" && Number.isInteger(value);
}
