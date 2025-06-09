import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import type { Tag } from "src/types/Tag.type";

type TagPillProps = {
  tag: Tag;
  size?: "sm" | "md" | "lg";
  variant?: "block" | "ghost";
  closable?: boolean;
  onClick?: (id: string) => void;
};

export const TagPill = ({
  tag,
  size = "sm",
  variant = "block",
  closable = false,
  onClick,
}: TagPillProps): JSX.Element => {
  const [closeButtonVisible, setCloseButtonVisible] = useState<boolean>(false);

  return (
    <div
      className="h-fit"
      onMouseOver={() => setCloseButtonVisible(true)}
      onMouseOut={() => setCloseButtonVisible(false)}
    >
      <Button
        variant={variant}
        colour={tag.colour}
        size={size}
        onClick={() => onClick && onClick(tag.id)}
        iconName={closable && closeButtonVisible ? "x" : tag.icon}
      >
        {tag.name}
      </Button>
    </div>
  );
};
