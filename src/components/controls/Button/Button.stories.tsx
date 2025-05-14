import { Button } from "./Button";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Button,
  title: "Controls/Button",
  tags: ["Atoms"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Story: Story = {
  render: (args) => (
    <span style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Button {...args} iconName={undefined}>
        Settings
      </Button>
      <Button {...args}>Settings</Button>
      <Button {...args} />
    </span>
  ),
  args: {
    iconName: "gear",
    size: "md",
    type: "button",
    variant: "block",
  },
};
