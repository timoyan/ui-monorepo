import { AutocompleteInput } from "../AutocompleteInput";
import { render, screen } from "@testing-library/react";

const defaultOptions = [
	{ label: "Apple", value: "apple" },
	{ label: "Banana", value: "banana" },
	{ label: "Cherry", value: "cherry" },
];

describe("AutocompleteInput", () => {
	it("renders combobox input with placeholder", () => {
		render(<AutocompleteInput options={defaultOptions} />);
		const input = screen.getByRole("combobox");
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("placeholder", "Type to search...");
	});

	it("renders custom placeholder when provided", () => {
		render(
			<AutocompleteInput
				options={defaultOptions}
				placeholder="Choose a fruit..."
			/>,
		);
		const input = screen.getByRole("combobox");
		expect(input).toHaveAttribute("placeholder", "Choose a fruit...");
	});

	it("accepts disabled prop", () => {
		render(<AutocompleteInput options={defaultOptions} disabled />);
		const input = screen.getByRole("combobox");
		expect(input).toBeDisabled();
	});

	// Opening the list and selecting options is covered by Ark/zag-js combobox behavior.
	// Full interaction tests may be added as E2E or in an environment where the combobox
	// selector (e.g. [role=option][data-value="..."]) is supported (e.g. jsdom).
});
