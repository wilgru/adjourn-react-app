import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "src/components/general/Icon/Icon";
import { colours } from "src/constants/colours.constant";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";

type NavItemProps = {
  iconName?: string;
  colour?: Colour;
  ghost?: boolean;
  title: string;
  preview?: string | number;
  to: string;
  expanded: boolean;
};

export const NavItem = ({
  iconName,
  colour = colours.orange,
  ghost = false,
  title,
  preview,
  to,
}: NavItemProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <Link
      to={to}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      activeProps={{
        className: cn(colour.textPill, colour.backgroundPill),
      }}
      className={cn(
        "flex justify-between items-center gap-2 px-2 py-1 rounded-full text-sm transition-colors",
        isHovered && colour.textPill,
        isHovered && colour.backgroundPill
      )}
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          <div
            className={cn(
              "flex items-center gap-2",
              (isHovered || isActive) && colour.textPill
            )}
          >
            {iconName && (
              <Icon
                iconName={iconName}
                className={
                  isHovered || isActive || (colour && !ghost)
                    ? colour.textPill
                    : "text-slate-500"
                }
                size="sm"
                weight={isHovered || isActive ? "fill" : "regular"}
              />
            )}

            {title}
          </div>

          <p
            className={cn(
              "text-xs text-start font-medium mr-1",
              isHovered || isActive ? colour.textPill : "text-slate-400"
            )}
          >
            {preview}
          </p>
        </>
      )}
    </Link>
  );
};
