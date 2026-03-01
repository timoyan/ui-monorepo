export function isValidProductCode(code: string): boolean {
	return code.length === 10 && code.startsWith("PROD-");
}
