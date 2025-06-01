import { colours } from "src/constants/colours.constant";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";

type PageHeaderProps = {
  children: React.ReactNode;
  colour?: Colour;
  primaryBadges?: string[];
  secondaryBadges?: string[];
};

export const PageHeader = ({
  children,
  colour = colours.orange,
  primaryBadges,
  secondaryBadges,
}: PageHeaderProps) => {
  return (
    <div className="pb-4">
      {children}

      <div className="flex gap-2">
        {primaryBadges?.map((primaryBadge, index) => (
          <h3
            key={index}
            className={cn(
              "px-2 py-0.5 text-sm rounded-full",
              colour.backgroundPill,
              colour.textPill
            )}
          >
            {primaryBadge}
          </h3>
        ))}

        {secondaryBadges?.map((secondaryBadge, index) => (
          <h3
            key={index}
            className={
              "px-2 py-0.5 text-sm rounded-full bg-slate-100 text-slate-500"
            }
          >
            {secondaryBadge}
          </h3>
        ))}
      </div>
    </div>
  );
};
