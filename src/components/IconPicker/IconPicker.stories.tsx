import { useState } from "react";
import { colours } from "src/constants/colours.constant";
import IconPicker from "./IconPicker";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: IconPicker,
  title: "Data Entry/IconPicker",
  tags: ["Molecules"],
} satisfies Meta<typeof IconPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Story: Story = {
  render: (args) => {
    const [selectedIconName, setSelectedIconName] = useState(
      args.selectedIconName
    );

    return (
      <IconPicker
        {...args}
        selectedIconName={selectedIconName}
        onSelectIcon={(iconName) => setSelectedIconName(iconName)}
      />
    );
  },
  args: {
    selectedIconName: "book",
    colour: colours.orange,
    onSelectIcon: () => {},
  },
};
