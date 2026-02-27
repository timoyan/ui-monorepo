import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiSlice } from "@/apis/apiSlice";
import type { CartItem } from "@/apis/cart";
import { useToast } from "@/core/toast";
import { server } from "@/mocks/server";
import { ModuleC } from "@/modules/c";
import { createReduxRender } from "@/test/renderWithRedux";

const mockToast = {
	create: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
	warning: vi.fn(),
	dismiss: vi.fn(),
};

function createMockCartItem(overrides?: Partial<CartItem>): CartItem {
	return {
		id: "cart-1",
		productId: "prod-1",
		productName: "Sample Product",
		quantity: 1,
		...overrides,
	};
}

vi.mock("@/core/toast", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/core/toast")>();
	return { ...actual, useToast: vi.fn() };
});

const { store, renderWithStore } = createReduxRender();

beforeEach(() => {
	store.dispatch(apiSlice.util.resetApiState());
	vi.mocked(useToast).mockReturnValue({
		toast: mockToast,
		registerAndToast: vi.fn(),
	});
	mockToast.success.mockClear();
	mockToast.error.mockClear();
});

describe("ModuleC", () => {
	it("renders cart heading", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		await screen.findByText(/cart is empty/i);
		expect(screen.getByRole("heading", { name: /cart/i })).toBeInTheDocument();
	});

	it("renders loading then empty cart with Add item button when API returns empty", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		const emptyMessage = await screen.findByText(/cart is empty/i);
		expect(emptyMessage).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /add item/i }),
		).toBeInTheDocument();
	});

	it("renders error state when cart fetch fails", async () => {
		server.use(
			http.get("http://test.com/api/cart", () =>
				HttpResponse.json({ error: "Server error" }, { status: 500 }),
			),
		);
		renderWithStore(<ModuleC />);
		await screen.findByText(/failed to load cart/i);
	});

	it("calls toast.error when add to cart fails", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
			http.post("http://test.com/api/cart/add", () =>
				HttpResponse.json({ error: "Server error" }, { status: 500 }),
			),
		);
		renderWithStore(<ModuleC />);
		await screen.findByText(/cart is empty/i);
		await act(async () => {
			await userEvent.click(screen.getByRole("button", { name: /add item/i }));
		});
		expect(mockToast.error).toHaveBeenCalledWith({
			title: "Failed to add",
			description: "Could not add item to cart.",
		});
	});

	it("adds item when Add item is clicked", async () => {
		const cartItems: CartItem[] = [];
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json(cartItems)),
			http.post("http://test.com/api/cart/add", async ({ request }) => {
				const body = (await request.json()) as {
					productId?: string;
					productName?: string;
					quantity?: number;
				};
				const item = createMockCartItem({
					id: `item-${Date.now()}`,
					productId: body.productId ?? "prod-1",
					productName: body.productName,
					quantity: body.quantity ?? 1,
				});
				cartItems.push(item);
				return HttpResponse.json(item);
			}),
		);
		renderWithStore(<ModuleC />);
		await screen.findByText(/cart is empty/i);
		await act(async () => {
			await userEvent.click(screen.getByRole("button", { name: /add item/i }));
		});
		await screen.findByText("Sample Product", { selector: "p" });
		expect(screen.getByText(/id: prod-sample/i)).toBeInTheDocument();
	});

	it("displays cart items from API", async () => {
		const items = [
			createMockCartItem({
				id: "item-1",
				productName: "Product A",
				productId: "prod-a",
				quantity: 2,
			}),
		];
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json(items)),
		);
		renderWithStore(<ModuleC />);
		await screen.findByText("Product A");
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product a/i,
		});
		expect(qtyInput).toHaveValue(2);
	});

	it("increases quantity when + is clicked", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product A",
			quantity: 1,
		});
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([item])),
			http.patch(
				"http://test.com/api/cart/updateQuantity",
				async ({ request }) => {
					const body = (await request.json()) as {
						itemId: string;
						quantity: number;
					};
					return HttpResponse.json({
						...item,
						quantity: body.quantity,
					});
				},
			),
		);
		renderWithStore(<ModuleC />);
		await screen.findByText("Product A");
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /increase quantity/i }),
			);
		});
		await screen.findByDisplayValue("2");
	});

	it("removes item when Remove is clicked", async () => {
		const productD = createMockCartItem({
			id: "item-d",
			productId: "prod-d",
			productName: "Product D",
			quantity: 1,
		});
		let cartItems: (typeof productD)[] = [productD];
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json(cartItems)),
			http.delete("http://test.com/api/cart/remove", () => {
				cartItems = [];
				return HttpResponse.json({ success: true });
			}),
		);
		renderWithStore(<ModuleC />);
		await screen.findByText("Product D");
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", {
					name: /remove product d from cart/i,
				}),
			);
		});
		await screen.findByText(/cart is empty/i);
		expect(screen.queryByText("Product D")).not.toBeInTheDocument();
	});

	it("calls toast.success when Show toast is clicked", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		const showToastBtn = screen.getByRole("button", { name: /show toast/i });
		await act(async () => {
			await userEvent.click(showToastBtn);
		});
		expect(mockToast.success).toHaveBeenCalledWith({
			title: "Hello from Module C",
			description: "Toast can be triggered from any module.",
		});
	});

	it("updates flow state to INIT when Set INIT is clicked", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		await act(async () => {
			await userEvent.click(screen.getByRole("button", { name: /set init/i }));
		});
		expect(store.getState().flow.modulesState.C).toMatchObject({
			name: "C",
			state: "INIT",
			message: "Module C (cart) reset",
		});
	});

	it("updates flow state to PROCESSING when Set PROCESSING is clicked", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set processing/i }),
			);
		});
		expect(store.getState().flow.modulesState.C).toMatchObject({
			name: "C",
			state: "PROCESSING",
			message: "Loading cart…",
		});
	});

	it("updates flow state to COMPLETED when Set COMPLETED is clicked", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set completed/i }),
			);
		});
		expect(store.getState().flow.modulesState.C).toMatchObject({
			name: "C",
			state: "COMPLETED",
			message: "Cart ready",
		});
	});

	it("updates flow state to FAILED when Set FAILED is clicked", async () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set failed/i }),
			);
		});
		expect(store.getState().flow.modulesState.C).toMatchObject({
			name: "C",
			state: "FAILED",
			message: "Error from Module C",
		});
	});
});
