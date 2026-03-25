import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
	title: "Components/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		tone: {
			control: "select",
			options: ["neutral", "danger"],
		},
		variant: {
			control: "select",
			options: ["solid", "outline", "ghost"],
		},
		size: {
			control: "select",
			options: ["sm", "md"],
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Button",
	},
};

export const DangerSolid: Story = {
	args: {
		children: "Delete",
		tone: "danger",
		variant: "solid",
	},
};

export const Outline: Story = {
	args: {
		children: "Outline",
		variant: "outline",
	},
};

export const Ghost: Story = {
	args: {
		children: "Ghost",
		variant: "ghost",
	},
};

export const Small: Story = {
	args: {
		children: "Small",
		size: "sm",
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled",
		disabled: true,
	},
};
