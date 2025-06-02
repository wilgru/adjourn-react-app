import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import type { Journal } from "src/types/Journal.type";

type TagPillProps = {
  journal: Journal;
  size?: "sm" | "md" | "lg";
  variant?: "block" | "ghost";
  closable?: boolean;
  onClick?: (id: string) => void;
};

export const TagPill = ({
  journal,
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
        colour={journal.colour}
        size={size}
        onClick={() => onClick && onClick(journal.id)}
        iconName={closable && closeButtonVisible ? "x" : journal.icon}
      >
        {journal.name}
      </Button>
    </div>
  );
};
