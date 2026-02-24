import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	ModuleB,
	ModuleBFullWidthDisabled,
	ModuleBVariantSize,
} from "@/modules/b";
import { useToast } from "@/core/toast";
import { createReduxRender } from "@/test/renderWithRedux";

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

const { store, renderWithStore } = createReduxRender();

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
		renderWithStore(<ModuleB />);
		expect(
			screen.getByRole("button", { name: /primary sm/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /full width primary/i }),
		).toBeInTheDocument();
	});

	it("calls toast.success when Success (toast examples) is clicked", async () => {
		renderWithStore(<ModuleB />);
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
		renderWithStore(<ModuleB />);
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
		renderWithStore(<ModuleB />);
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
		renderWithStore(<ModuleB />);
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
		renderWithStore(<ModuleBVariantSize />);
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
		renderWithStore(<ModuleBVariantSize />);
		expect(
			screen.getByRole("button", { name: /secondary/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /danger/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /ghost/i })).toBeInTheDocument();
	});

	it("dispatches setModuleState for B1 when flow state buttons are clicked", async () => {
		renderWithStore(<ModuleBVariantSize />);
		await act(async () => {
			await userEvent.click(screen.getByRole("button", { name: /set init/i }));
		});
		expect(store.getState().flow.modulesState.B1).toMatchObject({
			name: "B1",
			state: "INIT",
			message: "Module B1 (variant/size) reset",
		});
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set processing/i }),
			);
		});
		expect(store.getState().flow.modulesState.B1).toMatchObject({
			name: "B1",
			state: "PROCESSING",
			message: "Processing from B1…",
		});
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set completed/i }),
			);
		});
		expect(store.getState().flow.modulesState.B1).toMatchObject({
			name: "B1",
			state: "COMPLETED",
			message: "Module B1 completed",
		});
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set failed/i }),
			);
		});
		expect(store.getState().flow.modulesState.B1).toMatchObject({
			name: "B1",
			state: "FAILED",
			message: "Error from Module B1",
		});
	});
});

describe("ModuleBFullWidthDisabled", () => {
	it("renders Full Width Primary button", () => {
		renderWithStore(<ModuleBFullWidthDisabled />);
		expect(
			screen.getByRole("button", { name: /full width primary/i }),
		).toBeInTheDocument();
	});

	it("renders disabled Primary and Danger buttons", () => {
		renderWithStore(<ModuleBFullWidthDisabled />);
		const disabledPrimary = screen.getByRole("button", {
			name: /disabled primary/i,
		});
		const disabledDanger = screen.getByRole("button", {
			name: /disabled danger/i,
		});
		expect(disabledPrimary).toBeDisabled();
		expect(disabledDanger).toBeDisabled();
	});

	it("dispatches setModuleState for B2 when flow state buttons are clicked", async () => {
		renderWithStore(<ModuleBFullWidthDisabled />);
		await act(async () => {
			await userEvent.click(screen.getByRole("button", { name: /set init/i }));
		});
		expect(store.getState().flow.modulesState.B2).toMatchObject({
			name: "B2",
			state: "INIT",
			message: "Module B2 (fullWidth/disabled) reset",
		});
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set processing/i }),
			);
		});
		expect(store.getState().flow.modulesState.B2).toMatchObject({
			name: "B2",
			state: "PROCESSING",
			message: "Loading from B2…",
		});
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set completed/i }),
			);
		});
		expect(store.getState().flow.modulesState.B2).toMatchObject({
			name: "B2",
			state: "COMPLETED",
			message: "Module B2 completed",
		});
		await act(async () => {
			await userEvent.click(
				screen.getByRole("button", { name: /set failed/i }),
			);
		});
		expect(store.getState().flow.modulesState.B2).toMatchObject({
			name: "B2",
			state: "FAILED",
			message: "Error from Module B2",
		});
	});
});
