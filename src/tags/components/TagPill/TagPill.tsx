import { useState } from "react";
import { Button } from "src/common/components/Button/Button";
import { cn } from "src/common/utils/cn";
import type { Tag } from "src/tags/Tag.type";

type TagPillProps = {
  tag: Tag;
  size?: "xs" | "sm" | "md" | "lg";
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
        disabled={!onClick}
        iconName={closable && closeButtonVisible ? "x" : tag.icon}
      >
        {!collapsed && (
          <span
            className={cn(
              "inline-block overflow-hidden transition-all duration-300 ease-in-out max-w-[10rem] opacity-100",
            )}
          >
            {tag.name}
          </span>
        )}
      </Button>
    </div>
  );
};
