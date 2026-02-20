/**
 * Cart 相關 endpoint 名稱，使用 CART_BASE_URL；其餘使用 DEFAULT_BASE_URL。
 */
export const CART_ENDPOINTS = [
	"getCart",
	"addToCart",
	"updateQuantity",
	"removeFromCart",
] as const;

const DEFAULT_BASE_URL = "/api";
const CART_BASE_URL = "http://test.com/api";

/**
 * 依 endpoint 名稱回傳對應的 base URL。
 * Cart 相關 endpoint 使用 CART_BASE_URL，其餘使用 DEFAULT_BASE_URL。
 */
export function getBaseUrlForEndpoint(endpoint?: string): string {
	if (endpoint && (CART_ENDPOINTS as readonly string[]).includes(endpoint)) {
		return CART_BASE_URL;
	}
	return DEFAULT_BASE_URL;
}
