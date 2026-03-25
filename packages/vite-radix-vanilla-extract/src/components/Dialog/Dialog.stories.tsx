import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";

const meta = {
	title: "Components/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		triggerTone: {
			control: "select",
			options: ["neutral", "danger"],
		},
		overlayIntensity: {
			control: "select",
			options: ["subtle", "strong"],
		},
		closeAppearance: {
			control: "select",
			options: ["secondary", "ghost"],
		},
	},
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const DangerTrigger: Story = {
	args: {
		triggerTone: "danger",
	},
};

export const SubtleOverlay: Story = {
	args: {
		overlayIntensity: "subtle",
	},
};

export const GhostClose: Story = {
	args: {
		closeAppearance: "ghost",
	},
};
