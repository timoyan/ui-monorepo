import { afterEach, beforeEach, describe, expect, it } from "vitest";

import "./credit-card-form";

function waitForRender(): Promise<void> {
	return new Promise((resolve) => {
		if (typeof requestIdleCallback !== "undefined") {
			requestIdleCallback(() => resolve());
		} else {
			setTimeout(resolve, 0);
		}
	});
}

describe("credit-card-form", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("renders", async () => {
		const el = document.createElement("credit-card-form");
		document.body.appendChild(el);
		await waitForRender();
		// Allow async Adyen init to fail and Stencil to re-render with error state
		await new Promise((r) => setTimeout(r, 300));

		// Without Adyen config/sdk in test, init fails and component shows error state.
		const form = el.querySelector(".credit-card-form");
		expect(form).toBeTruthy();
		const container = el.querySelector(".adyen-container");
		expect(container).toBeTruthy();
		const errorEl = el.querySelector(".error-message");
		expect(errorEl).toBeTruthy();
		expect(errorEl?.textContent?.trim()).toContain("Adyen");
	});
});
