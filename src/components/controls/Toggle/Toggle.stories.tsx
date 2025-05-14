import { useState } from "react";
import { colours } from "src/constants/colours.constant";
import { Toggle } from "./Toggle";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Toggle,
  title: "Controls/Toggle",
  tags: ["Atoms"],
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Story: Story = {
  render: (args) => {
    const [isToggled, setIsToggled] = useState(false);

    return (
      <span style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Toggle
          {...args}
          iconName={undefined}
          isToggled={isToggled}
          onClick={() => setIsToggled(!isToggled)}
        >
          Settings
        </Toggle>
        <Toggle
          {...args}
          isToggled={isToggled}
          onClick={() => setIsToggled(!isToggled)}
        >
          Settings
        </Toggle>
        <Toggle
          {...args}
          isToggled={isToggled}
          onClick={() => setIsToggled(!isToggled)}
        />
      </span>
    );
  },
  args: {
    iconName: "gear",
    isToggled: false,
    colour: colours.orange,
    size: "md",
    onClick: () => {},
  },
};
