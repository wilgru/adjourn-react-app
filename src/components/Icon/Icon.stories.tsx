import { Icon } from "./Icon";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Icon,
  title: "Icon",
  tags: ["Atoms"],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    iconName: "gear",
    size: "md",
    weight: "regular",
  },
};
