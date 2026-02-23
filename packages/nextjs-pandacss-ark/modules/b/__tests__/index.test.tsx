import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	ModuleB,
	ModuleBFullWidthDisabled,
	ModuleBVariantSize,
} from "@/modules/b";
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
	return { ...actual, useToast: vi.fn() };
});

describe("ModuleB", () => {
	beforeEach(() => {
		vi.mocked(useToast).mockImplementation(() => ({
			toast: mockToast,
			registerAndToast: vi.fn(),
		}));
	});
	afterEach(() => {
		mockToast.success.mockClear();
		mockToast.error.mockClear();
		mockToast.info.mockClear();
		mockToast.warning.mockClear();
	});
	it("renders ModuleBVariantSize and ModuleBFullWidthDisabled", () => {
		render(<ModuleB />);
		expect(
			screen.getByRole("button", { name: /primary sm/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /full width primary/i }),
		).toBeInTheDocument();
	});

	it("calls toast.success when Success (toast examples) is clicked", async () => {
		render(<ModuleB />);
		const successBtn = screen.getByRole("button", { name: /^Success$/ });
		await act(async () => {
			await userEvent.click(successBtn);
		});
		expect(mockToast.success).toHaveBeenCalledWith({
			title: "Success",
			description: "Operation completed successfully.",
		});
	});

	it("calls toast.error when Error (toast examples) is clicked", async () => {
		render(<ModuleB />);
		const errorBtn = screen.getByRole("button", { name: /^Error$/ });
		await act(async () => {
			await userEvent.click(errorBtn);
		});
		expect(mockToast.error).toHaveBeenCalledWith({
			title: "Error",
			description: "Something went wrong. Please try again.",
		});
	});

	it("calls toast.warning when Warning (toast examples) is clicked", async () => {
		render(<ModuleB />);
		const warningBtn = screen.getByRole("button", { name: /^Warning$/ });
		await act(async () => {
			await userEvent.click(warningBtn);
		});
		expect(mockToast.warning).toHaveBeenCalledWith({
			title: "Warning",
			description: "Please check your input.",
		});
	});

	it("calls toast.info when Info (toast examples) is clicked", async () => {
		render(<ModuleB />);
		const infoBtn = screen.getByRole("button", { name: /^Info$/ });
		await act(async () => {
			await userEvent.click(infoBtn);
		});
		expect(mockToast.info).toHaveBeenCalledWith({
			title: "Info",
			description: "Here is some information.",
		});
	});
});

describe("ModuleBVariantSize", () => {
	it("renders primary size buttons (SM, MD, LG)", () => {
		render(<ModuleBVariantSize />);
		expect(
			screen.getByRole("button", { name: /primary sm/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /primary md/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /primary lg/i }),
		).toBeInTheDocument();
	});

	it("renders secondary, danger, and ghost buttons", () => {
		render(<ModuleBVariantSize />);
		expect(
			screen.getByRole("button", { name: /secondary/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /danger/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /ghost/i })).toBeInTheDocument();
	});
});

describe("ModuleBFullWidthDisabled", () => {
	it("renders Full Width Primary button", () => {
		render(<ModuleBFullWidthDisabled />);
		expect(
			screen.getByRole("button", { name: /full width primary/i }),
		).toBeInTheDocument();
	});

	it("renders disabled Primary and Danger buttons", () => {
		render(<ModuleBFullWidthDisabled />);
		const disabledPrimary = screen.getByRole("button", {
			name: /disabled primary/i,
		});
		const disabledDanger = screen.getByRole("button", {
			name: /disabled danger/i,
		});
		expect(disabledPrimary).toBeDisabled();
		expect(disabledDanger).toBeDisabled();
	});
});
