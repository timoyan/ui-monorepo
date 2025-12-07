import { test, expect } from "@playwright/test";

test.describe("Next.js 14 App", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("should display the page title", async ({ page }) => {
		await expect(page).toHaveTitle(/Next.js 18 App/);
	});

	test("should display the main heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Next.js 18 App using ui package" }),
		).toBeVisible();
	});

	test("should display all button variants", async ({ page }) => {
		await expect(
			page.getByRole("button", { name: "Primary", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Success", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Danger", exact: true }),
		).toBeVisible();
	});

	test("should open and close modal", async ({ page }) => {
		// Open modal
		await page.getByRole("button", { name: "Open Modal" }).click();

		// Check modal is visible by checking for the title
		await expect(
			page.getByRole("heading", { name: "Example Modal" }),
		).toBeVisible();

		// Check modal content
		await expect(
			page.getByText("This is a modal dialog using the HTML dialog element."),
		).toBeVisible();

		// Close modal using Cancel button
		await page.getByRole("button", { name: "Cancel" }).click();

		// Check modal is closed
		await expect(
			page.getByRole("heading", { name: "Example Modal" }),
		).not.toBeVisible();
	});

	test("should close modal by clicking backdrop", async ({ page }) => {
		// Open modal
		await page.getByRole("button", { name: "Open Modal" }).click();

		// Wait for modal to be visible
		const modalHeading = page.getByRole("heading", { name: "Example Modal" });
		await expect(modalHeading).toBeVisible();

		// Click backdrop - the backdrop click handler checks if e.target === dialogRef.current
		// Use evaluate to directly trigger a click event on the dialog element itself
		await page.evaluate(() => {
			const dialog = document.querySelector(
				"dialog[open]",
			) as HTMLDialogElement;
			if (dialog) {
				// Create a click event that targets the dialog element directly
				const clickEvent = new MouseEvent("click", {
					bubbles: true,
					cancelable: true,
					view: window,
				});
				// Set the target to the dialog element
				Object.defineProperty(clickEvent, "target", {
					writable: false,
					value: dialog,
				});
				dialog.dispatchEvent(clickEvent);
			}
		});

		// Wait for modal to close
		await expect(modalHeading).not.toBeVisible({ timeout: 2000 });
	});

	test("should display card component", async ({ page }) => {
		await expect(page.getByText("Card Title")).toBeVisible();
		await expect(
			page.getByText("This is a card from the shared ui package."),
		).toBeVisible();
		// Check for the Confirm button in the card footer (which indicates footer is rendered)
		const card = page
			.locator('text="This is a card from the shared ui package."')
			.locator("..")
			.locator("..");
		await expect(card.getByRole("button", { name: "Confirm" })).toBeVisible();
	});

	test("should show success toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Success Toast" }).click();

		// Wait for toast to appear
		await expect(
			page.getByText("Operation completed successfully!"),
		).toBeVisible({ timeout: 2000 });
	});

	test("should show error toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Error Toast" }).click();

		// Wait for toast to appear
		await expect(page.getByText("Something went wrong!")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should show warning toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Warning Toast" }).click();

		// Wait for toast to appear
		await expect(page.getByText("Please review this action")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should show info toast", async ({ page }) => {
		await page.getByRole("button", { name: "Show Info Toast" }).click();

		// Wait for toast to appear
		await expect(page.getByText("Here's some information")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should show toast with action button", async ({ page }) => {
		await page.getByRole("button", { name: "Toast with Action" }).click();

		// Wait for toast to appear
		await expect(page.getByText("File saved successfully")).toBeVisible({
			timeout: 2000,
		});

		// Check for action button
		await expect(page.getByRole("button", { name: "Undo" })).toBeVisible({
			timeout: 2000,
		});

		// Click action button
		await page.getByRole("button", { name: "Undo" }).click();

		// Check for the info toast after clicking undo
		await expect(page.getByText("File restore initiated")).toBeVisible({
			timeout: 2000,
		});
	});

	test("should close toast by clicking close button", async ({ page }) => {
		await page.getByRole("button", { name: "Show Success Toast" }).click();

		// Wait for toast to appear
		const toastMessage = page.getByText("Operation completed successfully!");
		await expect(toastMessage).toBeVisible({ timeout: 2000 });

		// Find the toast container and locate the close button
		// The close button is typically the last button in the toast
		const toastContainer = toastMessage.locator("..").locator("..");
		const closeButton = toastContainer.getByRole("button").last();
		await closeButton.click();

		// Wait for toast to disappear
		await expect(toastMessage).not.toBeVisible({ timeout: 3000 });
	});
});
