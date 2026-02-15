import { http, HttpResponse } from "msw";
import {
	getCart,
	addToCart,
	updateQuantity,
	removeFromCart,
} from "./stores/cartStore";

/**
 * MSW handlers for local dev and unit tests.
 * Cart handlers share one in-memory data source (cartStore) so add/update/remove
 * behave like a real backend. Reset cart between tests via resetCartStore().
 */
export const handlers = [
	http.get("http://test.com/api/cart", () => {
		return HttpResponse.json(getCart());
	}),

	http.post("http://test.com/api/cart/add", async ({ request }) => {
		const body = (await request.json()) as {
			productId?: string;
			productName?: string;
			quantity?: number;
		};
		const item = addToCart({
			productId: body.productId ?? "prod-1",
			productName: body.productName,
			quantity: body.quantity,
		});
		return HttpResponse.json(item);
	}),

	http.patch("http://test.com/api/cart/updateQuantity", async ({ request }) => {
		const body = (await request.json()) as {
			itemId?: string;
			quantity?: number;
		};
		const itemId = body.itemId;
		const quantity = body.quantity ?? 1;
		if (!itemId) {
			return HttpResponse.json({ error: "itemId required" }, { status: 400 });
		}
		const updated = updateQuantity(itemId, quantity);
		if (!updated) {
			return HttpResponse.json(
				{ error: "Cart item not found" },
				{ status: 404 },
			);
		}
		return HttpResponse.json(updated);
	}),

	http.delete("http://test.com/api/cart/remove", async ({ request }) => {
		let itemId: string | undefined;
		try {
			const body = (await request.json()) as { itemId?: string };
			itemId = body.itemId;
		} catch {
			// Body may be empty
		}
		if (!itemId) {
			return HttpResponse.json({ error: "itemId required" }, { status: 400 });
		}
		const removed = removeFromCart(itemId);
		if (!removed) {
			return HttpResponse.json(
				{ error: "Cart item not found" },
				{ status: 404 },
			);
		}
		return HttpResponse.json({ success: true });
	}),
];
