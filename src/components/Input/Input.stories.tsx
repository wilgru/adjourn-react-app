import { Input } from "./Input";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Input,
  title: "Data Entry/Input",
  tags: ["Atoms"],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Story: Story = {
  args: {
    id: "id",
    type: "text",
    value: "value",
    onChange: () => {},
    size: "md",
  },
};
