import type { Middleware } from "@reduxjs/toolkit";
import { cartApi } from "@/apis/cart";
import { toast } from "@/core/toast/toastApi";

/**
 * Shows a toast when cart remove mutation succeeds.
 */
export const toastMiddleware: Middleware = () => (next) => (action) => {
	const result = next(action);

	if (cartApi.endpoints.removeFromCart.matchFulfilled(action)) {
		toast.success({
			title: "Removed from cart",
			description: "The item has been removed from your cart.",
		});
	}

	return result;
};
