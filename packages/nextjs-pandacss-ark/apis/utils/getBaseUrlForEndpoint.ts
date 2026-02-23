/**
 * Endpoint names that use the cart API origin (test.com); others use DEFAULT_BASE_URL.
 */
export const CART_ENDPOINTS = [
	"getCart",
	"addToCart",
	"updateQuantity",
	"removeFromCart",
] as const;

const DEFAULT_BASE_URL = "/api";
const CART_ORIGIN_FALLBACK = "http://test.com";

/**
 * Cart API origin. Uses current page protocol in the browser to avoid mixed content
 * (HTTPS page requesting HTTP). On server or when window is undefined, returns http.
 */
export function getCartApiOrigin(): string {
	if (typeof window !== "undefined" && window.location?.protocol === "https:") {
		return "https://test.com";
	}
	return CART_ORIGIN_FALLBACK;
}

/**
 * Returns the base URL for the given endpoint. Cart endpoints use the cart API origin;
 * others use DEFAULT_BASE_URL.
 */
export function getBaseUrlForEndpoint(endpoint?: string): string {
	if (endpoint && (CART_ENDPOINTS as readonly string[]).includes(endpoint)) {
		return `${getCartApiOrigin()}/api`;
	}
	return DEFAULT_BASE_URL;
}
