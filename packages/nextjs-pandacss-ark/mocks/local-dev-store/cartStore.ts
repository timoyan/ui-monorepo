import type { CartItem } from "@/apis/cart";

/**
 * In-memory cart shared by all cart MSW handlers.
 * Simulates a single backend data source: add/update/remove operate on the same state.
 * Reset between tests via resetCartStore() so tests don't leak state.
 */
let cart: CartItem[] = [];

function nextId(): string {
	return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Returns a copy of the current cart. */
export function getCart(): CartItem[] {
	return [...cart];
}

/** Adds an item; quantity is clamped to at least 1. */
export function addToCart(item: {
	productId: string;
	productName?: string;
	quantity?: number;
}): CartItem {
	const quantity = Math.max(1, item.quantity ?? 1);
	const newItem: CartItem = {
		id: nextId(),
		productId: item.productId,
		productName: item.productName ?? "Sample Product",
		quantity,
	};
	cart.push(newItem);
	return newItem;
}

/** Updates quantity (clamped to >= 0). Returns null if item not found. */
export function updateQuantity(
	itemId: string,
	quantity: number,
): CartItem | null {
	const index = cart.findIndex((i) => i.id === itemId);
	if (index === -1) return null;
	const q = Math.max(0, quantity);
	cart[index] = { ...cart[index], quantity: q };
	return cart[index];
}

/** Removes an item by id. Returns true if found and removed. */
export function removeFromCart(itemId: string): boolean {
	const index = cart.findIndex((i) => i.id === itemId);
	if (index === -1) return false;
	cart.splice(index, 1);
	return true;
}

/** Reset cart to empty. Call in test beforeEach when tests depend on cart state. */
export function resetCartStore(): void {
	cart = [];
}

/**
 * Seed cart with demo items for local dev. Call after resetCartStore() if you want
 * a known starting state (e.g. in browser console or a dev-only UI).
 */
export function seedCart(
	items?: { productId: string; productName?: string; quantity?: number }[],
): CartItem[] {
	const defaultItems = [
		{ productId: "prod-demo-1", productName: "Demo Product A", quantity: 2 },
		{ productId: "prod-demo-2", productName: "Demo Product B", quantity: 1 },
	];
	for (const item of items ?? defaultItems) {
		addToCart(item);
	}
	return getCart();
}
