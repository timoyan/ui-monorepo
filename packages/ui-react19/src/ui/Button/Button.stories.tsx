import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	title: "UI/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["primary", "secondary", "success", "danger"],
		},
		disabled: {
			control: "boolean",
		},
		children: {
			control: "text",
		},
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
	args: {
		variant: "primary",
		children: "Button",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Button",
	},
};

export const Success: Story = {
	args: {
		variant: "success",
		children: "Button",
	},
};

export const Danger: Story = {
	args: {
		variant: "danger",
		children: "Button",
	},
};

export const Disabled: Story = {
	args: {
		variant: "primary",
		children: "Disabled Button",
		disabled: true,
	},
};

export const AllVariants: Story = {
	render: () => (
		<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="success">Success</Button>
			<Button variant="danger">Danger</Button>
		</div>
	),
};
