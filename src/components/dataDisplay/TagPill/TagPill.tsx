import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { cn } from "src/utils/cn";
import type { Tag } from "src/types/Tag.type";

type TagPillProps = {
  tag: Tag;
  size?: "sm" | "md" | "lg";
  variant?: "block" | "ghost" | "link";
  closable?: boolean;
  collapsed?: boolean;
  onClick?: (id: string) => void;
};

export const TagPill = ({
  tag,
  size = "sm",
  variant = "block",
  closable = false,
  collapsed = false,
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
        <span
          className={cn(
            "inline-block overflow-hidden transition-all duration-300 ease-in-out",
            collapsed
              ? "max-w-0 opacity-0 -mr-2 delay-100"
              : "max-w-[10rem] opacity-100"
          )}
        >
          {tag.name}
        </span>
      </Button>
    </div>
  );
};
