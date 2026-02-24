/**
 * Cookie consent persistence in sessionStorage.
 * Avoids showing the cookie dialog again on refresh within the same session.
 */

const COOKIE_CONFIRM_KEY = "flow:cookieConfirm";

/** Returns stored consent (true/false) or null if not set. Safe to call in SSR (returns null). */
export function getCookieConfirmFromStorage(): boolean | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = sessionStorage.getItem(COOKIE_CONFIRM_KEY);
		if (raw === "true") return true;
		if (raw === "false") return false;
		return null;
	} catch {
		return null;
	}
}

/** Persists consent; call from client after user confirms. */
export function setCookieConfirmInStorage(accepted: boolean): void {
	if (typeof window === "undefined") return;
	try {
		sessionStorage.setItem(COOKIE_CONFIRM_KEY, String(accepted));
	} catch {
		// ignore
	}
}
