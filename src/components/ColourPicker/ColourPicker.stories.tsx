import { useState } from "react";
import { ColourPicker } from "./ColourPicker";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: ColourPicker,
  title: "Data Entry/ColourPicker",
  tags: ["Atoms"],
} satisfies Meta<typeof ColourPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [selectedColourName, setSelectedColourName] = useState(
      args.selectedColourName
    );

    return (
      <ColourPicker
        {...args}
        selectedColourName={selectedColourName}
        onSelectColour={(colour) => setSelectedColourName(colour.name)}
      />
    );
  },
  args: {
    selectedColourName: "red",
    onSelectColour: () => {},
  },
};
