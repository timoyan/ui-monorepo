import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { act } from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiSlice } from "@/apis/apiSlice";
import { store } from "@/core/store";
import { useToast } from "@/core/toast";
import { server } from "@/mocks/server";
import { ModuleC } from "@/modules/c";

const mockToast = {
	create: vi.fn(),
	success: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
	warning: vi.fn(),
	dismiss: vi.fn(),
};

vi.mock("@/core/toast", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/core/toast")>();
	return { ...actual, useToast: vi.fn() };
});

function renderWithStore(ui: React.ReactElement) {
	return render(<Provider store={store}>{ui}</Provider>);
}

beforeEach(() => {
	store.dispatch(apiSlice.util.resetApiState());
	vi.mocked(useToast).mockReturnValue({
		toast: mockToast,
		registerAndToast: vi.fn(),
	});
	mockToast.success.mockClear();
});

describe("ModuleC", () => {
	it("renders cart heading", () => {
		server.use(
			http.get("http://test.com/api/cart", () => HttpResponse.json([])),
		);
		renderWithStore(<ModuleC />);
		expect(screen.getByRole("heading", { name: /cart/i })).toBeInTheDocument();
	});

	it("renders empty cart with Add item button when API returns empty", async () => {
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
});
