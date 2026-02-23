import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DynamicToastDescription, ModuleA } from "@/modules/a";
import { useToast } from "@/core/toast";

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
	return {
		...actual,
		useToast: vi.fn(),
	};
});

describe("ModuleA", () => {
	afterEach(() => {
		mockToast.success.mockClear();
		mockToast.info.mockClear();
	});

	beforeEach(() => {
		vi.mocked(useToast).mockReturnValue({
			toast: mockToast,
			registerAndToast: vi.fn(),
		});
	});
	it("renders accordion triggers for PandaCSS and Ark UI", () => {
		render(<ModuleA />);
		expect(
			screen.getByRole("button", { name: /what is pandacss\?/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /what is ark ui\?/i }),
		).toBeInTheDocument();
	});

	it("renders PandaCSS content when first item is expanded by default", () => {
		render(<ModuleA />);
		expect(
			screen.getByText(/PandaCSS is a build-time CSS-in-JS framework/i),
		).toBeInTheDocument();
	});

	it("renders Ark UI content when second trigger is clicked", async () => {
		render(<ModuleA />);
		const arkTrigger = screen.getByRole("button", {
			name: /what is ark ui\?/i,
		});
		await act(async () => {
			await userEvent.click(arkTrigger);
		});
		expect(
			screen.getByText(/Ark UI is a headless, accessible component library/i),
		).toBeInTheDocument();
	});

	it("renders two accordion triggers and five toast demo buttons", () => {
		render(<ModuleA />);
		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(7);
		expect(
			screen.getByRole("button", { name: /success toast/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /info toast/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /toast \(registry\)/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /toast \(html via registry\)/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", {
				name: /toast \(one-time dynamic \+ react component\)/i,
			}),
		).toBeInTheDocument();
	});

	it("calls toast.success when Success toast is clicked", async () => {
		render(<ModuleA />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /success toast/i }),
			);
		});
		expect(mockToast.success).toHaveBeenCalledWith({
			title: "Success — saved",
			description: "Triggered from Module A button click.",
		});
	});

	it("calls toast.info when Info toast is clicked", async () => {
		render(<ModuleA />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /info toast/i }),
			);
		});
		expect(mockToast.info).toHaveBeenCalledWith({
			title: "Info",
			description: "Centralized toast from module.",
		});
	});

	it("calls toast.success with registry contentKey when Toast (registry) is clicked", async () => {
		render(<ModuleA />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /toast \(registry\)/i }),
			);
		});
		expect(mockToast.success).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Fallback title",
				description: "Overridden by registry when contentKey is set.",
				meta: expect.objectContaining({ contentKey: "success-with-icon" }),
			}),
		);
	});

	it("calls toast.success with success-html contentKey when Toast (HTML via registry) is clicked", async () => {
		render(<ModuleA />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /toast \(html via registry\)/i }),
			);
		});
		expect(mockToast.success).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "HTML demo",
				meta: expect.objectContaining({ contentKey: "success-html" }),
			}),
		);
	});

	it("renders DynamicToastDescription with given at time", () => {
		render(<DynamicToastDescription at="12:34:56" />);
		expect(screen.getByText(/one-time toast created at/i)).toBeInTheDocument();
		expect(screen.getByText("12:34:56")).toBeInTheDocument();
		expect(screen.getByText(/dismiss to unregister/i)).toBeInTheDocument();
	});

	it("DynamicToastDescription with onTriggerAnother renders Trigger another toast and calls callback when clicked", async () => {
		const onTriggerAnother = vi.fn();
		render(
			<DynamicToastDescription
				at="12:00:00"
				onTriggerAnother={onTriggerAnother}
			/>,
		);
		expect(screen.getByText(/one-time toast created at/i)).toBeInTheDocument();
		const triggerButton = screen.getByRole("button", {
			name: /trigger another toast/i,
		});
		expect(triggerButton).toBeInTheDocument();
		await act(async () => {
			await userEvent.click(triggerButton);
		});
		expect(onTriggerAnother).toHaveBeenCalledTimes(1);
	});

	it("DynamicToastDescription without onTriggerAnother does not render Trigger another toast button", () => {
		render(<DynamicToastDescription at="12:00:00" />);
		expect(
			screen.queryByRole("button", { name: /trigger another toast/i }),
		).not.toBeInTheDocument();
	});

	it("calls registerAndToast when Toast (one-time dynamic) is clicked", async () => {
		const mockRegisterAndToast = vi.fn();
		vi.mocked(useToast).mockReturnValue({
			toast: mockToast,
			registerAndToast: mockRegisterAndToast,
		});
		render(<ModuleA />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", {
					name: /toast \(one-time dynamic \+ react component\)/i,
				}),
			);
		});
		expect(mockRegisterAndToast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Dynamic toast (React component)",
			}),
			expect.objectContaining({ type: "error", unregisterOnDismiss: true }),
		);
	});

	it("calling onTriggerAnother from dynamic toast content triggers registerAndToast for Second toast (showSecondToast)", async () => {
		const mockRegisterAndToast = vi.fn();
		vi.mocked(useToast).mockReturnValue({
			toast: mockToast,
			registerAndToast: mockRegisterAndToast,
		});
		render(<ModuleA />);
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", {
					name: /toast \(one-time dynamic \+ react component\)/i,
				}),
			);
		});
		expect(mockRegisterAndToast).toHaveBeenCalledTimes(1);
		const firstCallContent = mockRegisterAndToast.mock.calls[0][0];
		const onTriggerAnother =
			firstCallContent.description?.props?.onTriggerAnother;
		expect(typeof onTriggerAnother).toBe("function");
		await act(async () => {
			onTriggerAnother();
		});
		expect(mockRegisterAndToast).toHaveBeenCalledTimes(2);
		expect(mockRegisterAndToast).toHaveBeenLastCalledWith(
			expect.objectContaining({
				title: "Second toast",
				description: "Triggered from inside the first toast.",
			}),
			expect.objectContaining({ type: "success", unregisterOnDismiss: true }),
		);
	});
});
