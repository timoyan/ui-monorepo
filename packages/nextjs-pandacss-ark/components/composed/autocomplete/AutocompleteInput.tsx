"use client";

import { createListCollection } from "@ark-ui/react/collection";
import {
	ComboboxInput as ArkComboboxInput,
	ComboboxContent,
	ComboboxControl,
	ComboboxItem,
	ComboboxItemText,
	ComboboxPositioner,
	ComboboxRoot,
} from "@ark-ui/react/combobox";
import { useMemo, useState } from "react";
import { Input } from "@/components/atomics/input";
import { styled } from "@/styled-system/jsx";

const StyledPositioner = styled(ComboboxPositioner, {
	base: {
		position: "absolute",
		zIndex: 50,
		w: "var(--reference-width)",
		mt: 1,
	},
});

const StyledContent = styled(ComboboxContent, {
	base: {
		maxH: "60",
		overflowY: "auto",
		bg: "white",
		borderWidth: "1px",
		borderColor: "gray.200",
		borderRadius: "md",
		boxShadow: "md",
		py: 1,
	},
});

const StyledItem = styled(ComboboxItem, {
	base: {
		px: 3,
		py: 2,
		cursor: "pointer",
		fontSize: "md",
		color: "gray.900",
		_hover: { bg: "gray.100" },
		_focus: { bg: "gray.100" },
		"&[data-highlighted]": { bg: "gray.100" },
	},
});

export interface AutocompleteOption {
	label: string;
	value: string;
}

export interface AutocompleteInputProps {
	/** Options to show in the dropdown. */
	options: AutocompleteOption[];
	/** Placeholder for the input. */
	placeholder?: string;
	/** Controlled value (single selection). */
	value?: string;
	/** Called when selection changes. */
	onValueChange?: (details: {
		value: string;
		item: AutocompleteOption;
	}) => void;
	/** Whether the input is disabled. */
	disabled?: boolean;
	/** Input id for accessibility. */
	id?: string;
}

/**
 * Composed autocomplete input built from Input atomic and Ark Combobox.
 * Uses only components/atomics; dropdown is styled with Panda.
 */
/** Filter options by keyword (label contains keyword, case-insensitive). */
function filterOptionsByKeyword(
	options: AutocompleteOption[],
	keyword: string,
): AutocompleteOption[] {
	const k = keyword.trim().toLowerCase();
	if (!k) return options;
	return options.filter((o) => o.label.toLowerCase().includes(k));
}

export function AutocompleteInput({
	options,
	placeholder = "Type to search...",
	value,
	onValueChange,
	disabled = false,
	id,
}: AutocompleteInputProps) {
	const [inputValue, setInputValue] = useState("");
	const filteredOptions = useMemo(
		() => filterOptionsByKeyword(options, inputValue),
		[options, inputValue],
	);
	const collection = useMemo(
		() =>
			createListCollection<AutocompleteOption>({
				items: filteredOptions,
				itemToString: (item) => item.label,
				itemToValue: (item) => item.value,
			}),
		[filteredOptions],
	);

	return (
		<ComboboxRoot
			collection={collection}
			closeOnSelect
			inputBehavior="autohighlight"
			openOnClick={false}
			value={value != null ? [value] : undefined}
			onValueChange={(details: {
				value?: string[];
				items?: AutocompleteOption[];
			}) => {
				const v = details.value?.[0];
				const item =
					details.items?.[0] ??
					(v != null ? options.find((o) => o.value === v) : undefined);
				if (v != null && item) {
					setInputValue(item.label);
					onValueChange?.({ value: v, item });
				}
			}}
			disabled={disabled}
		>
			<ComboboxControl>
				<ArkComboboxInput
					asChild
					placeholder={placeholder}
					id={id}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						const next = event.target.value;
						setInputValue(next);
					}}
				>
					<Input />
				</ArkComboboxInput>
			</ComboboxControl>
			<StyledPositioner>
				<StyledContent>
					{filteredOptions.map((option) => (
						<StyledItem key={option.value} item={option}>
							<ComboboxItemText>{option.label}</ComboboxItemText>
						</StyledItem>
					))}
				</StyledContent>
			</StyledPositioner>
		</ComboboxRoot>
	);
}
