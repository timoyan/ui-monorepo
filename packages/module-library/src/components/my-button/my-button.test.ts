import { afterEach, beforeEach, describe, expect, it } from "vitest";

import "./my-button";

function waitForRender(): Promise<void> {
	return new Promise((resolve) => {
		if (typeof requestIdleCallback !== "undefined") {
			requestIdleCallback(() => resolve());
		} else {
			setTimeout(resolve, 0);
		}
	});
}

describe("my-button", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("renders", async () => {
		const el = document.createElement("my-button");
		el.textContent = "Click me";
		document.body.appendChild(el);
		await waitForRender();

		const button = el.querySelector("button");
		expect(button).toBeTruthy();
		expect(button?.className).toContain("btn btn-primary btn-md");
		expect(button?.getAttribute("type")).toBe("button");
		expect(button?.textContent?.trim()).toBe("Click me");
	});

	it("renders with variant", async () => {
		const el = document.createElement("my-button");
		el.setAttribute("variant", "secondary");
		el.textContent = "Secondary";
		document.body.appendChild(el);
		await waitForRender();

		const button = el.querySelector("button");
		expect(button).toBeTruthy();
		expect(button?.className).toContain("btn btn-secondary btn-md");
		expect(button?.textContent?.trim()).toBe("Secondary");
	});

	it("renders disabled state", async () => {
		const el = document.createElement("my-button");
		el.setAttribute("disabled", "");
		el.textContent = "Disabled";
		document.body.appendChild(el);
		await waitForRender();

		const button = el.querySelector("button");
		expect(button?.hasAttribute("disabled")).toBe(true);
	});
});
