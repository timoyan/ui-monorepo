import { test, expect } from "@playwright/test";

test.describe("Vite React 19 App", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:5174");
	});

	test("should display the page title", async ({ page }) => {
		await expect(page).toHaveTitle(/vite-react19/);
	});

	test("should display the main heading", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Vite React App using ui package" }),
		).toBeVisible();
	});

	test("should display all button variants", async ({ page }) => {
		await expect(
			page.getByRole("button", { name: "Secondary", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Success", exact: true }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Danger", exact: true }),
		).toBeVisible();
	});

	test("should display card component", async ({ page }) => {
		await expect(page.getByText("Card Title")).toBeVisible();
		await expect(
			page.getByText("This is a card from the shared ui package."),
		).toBeVisible();
		// Check for the footer text in the card
		await expect(page.getByText("Footer")).toBeVisible();
	});
});
