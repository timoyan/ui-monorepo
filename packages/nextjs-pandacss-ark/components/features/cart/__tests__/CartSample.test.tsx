import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createMockCartItem } from "@/mocks/fixtures";
import { CartSample } from "../CartSample";

describe("CartSample", () => {
	it("renders loading state", () => {
		render(
			<CartSample
				items={[]}
				isLoading={true}
				error={false}
				onAddItem={vi.fn()}
				isAdding={false}
				onUpdateQuantity={vi.fn()}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cart")).toBeInTheDocument();
		expect(screen.getByText(/loading cart…/i)).toBeInTheDocument();
	});

	it("renders error state", () => {
		render(
			<CartSample
				items={[]}
				isLoading={false}
				error={true}
				onAddItem={vi.fn()}
				isAdding={false}
				onUpdateQuantity={vi.fn()}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByText("Cart")).toBeInTheDocument();
		expect(screen.getByText(/failed to load cart/i)).toBeInTheDocument();
	});

	it("renders empty cart and calls onAddItem when Add item is clicked", async () => {
		const onAddItem = vi.fn();
		render(
			<CartSample
				items={[]}
				isLoading={false}
				error={false}
				onAddItem={onAddItem}
				isAdding={false}
				onUpdateQuantity={vi.fn()}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
		const addButton = screen.getByRole("button", { name: /add item/i });
		await userEvent.click(addButton);
		expect(onAddItem).toHaveBeenCalledTimes(1);
	});

	it("disables Add item button and shows Adding… when isAdding is true", () => {
		render(
			<CartSample
				items={[]}
				isLoading={false}
				error={false}
				onAddItem={vi.fn()}
				isAdding={true}
				onUpdateQuantity={vi.fn()}
				onRemove={vi.fn()}
			/>,
		);
		const addButton = screen.getByRole("button", { name: /adding…/i });
		expect(addButton).toBeDisabled();
	});

	it("displays cart items and calls onUpdateQuantity when + is clicked", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product A",
			quantity: 1,
		});
		const onUpdateQuantity = vi.fn();
		render(
			<CartSample
				items={[item]}
				isLoading={false}
				error={false}
				onAddItem={vi.fn()}
				isAdding={false}
				onUpdateQuantity={onUpdateQuantity}
				onRemove={vi.fn()}
			/>,
		);
		expect(screen.getByText("Product A")).toBeInTheDocument();
		await userEvent.click(
			screen.getByRole("button", { name: /increase quantity/i }),
		);
		expect(onUpdateQuantity).toHaveBeenCalledWith("item-1", 2);
	});

	it("calls onRemove when Remove is clicked", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product B",
			quantity: 1,
		});
		const onRemove = vi.fn();
		render(
			<CartSample
				items={[item]}
				isLoading={false}
				error={false}
				onAddItem={vi.fn()}
				isAdding={false}
				onUpdateQuantity={vi.fn()}
				onRemove={onRemove}
			/>,
		);
		await userEvent.click(
			screen.getByRole("button", { name: /remove product b from cart/i }),
		);
		expect(onRemove).toHaveBeenCalledWith("item-1");
	});

	it("calls onUpdateQuantity on quantity input blur when value changed", async () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product C",
			quantity: 2,
		});
		const onUpdateQuantity = vi.fn();
		render(
			<CartSample
				items={[item]}
				isLoading={false}
				error={false}
				onAddItem={vi.fn()}
				isAdding={false}
				onUpdateQuantity={onUpdateQuantity}
				onRemove={vi.fn()}
			/>,
		);
		const qtyInput = screen.getByRole("spinbutton", {
			name: /quantity for product c/i,
		});
		fireEvent.change(qtyInput, { target: { value: "5" } });
		fireEvent.blur(qtyInput);
		expect(onUpdateQuantity).toHaveBeenCalledWith("item-1", 5);
	});

	it("disables row controls when item id is in busyItemIds", () => {
		const item = createMockCartItem({
			id: "item-1",
			productName: "Product D",
			quantity: 2,
		});
		render(
			<CartSample
				items={[item]}
				isLoading={false}
				error={false}
				onAddItem={vi.fn()}
				isAdding={false}
				onUpdateQuantity={vi.fn()}
				onRemove={vi.fn()}
				busyItemIds={new Set(["item-1"])}
			/>,
		);
		expect(
			screen.getByRole("button", { name: /increase quantity/i }),
		).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /decrease quantity/i }),
		).toBeDisabled();
		expect(
			screen.getByRole("button", { name: /remove product d from cart/i }),
		).toBeDisabled();
	});
});
