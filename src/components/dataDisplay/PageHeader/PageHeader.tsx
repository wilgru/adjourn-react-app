import { Icon } from "src/components/general/Icon/Icon";
import { colours } from "src/constants/colours.constant";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";
import type { TagBadge } from "src/types/Tag.type";

type PageHeaderProps = {
  children: React.ReactNode;
  colour?: Colour;
  primaryBadges?: TagBadge[];
  secondaryBadges?: string[];
  description?: string;
};

export const PageHeader = ({
  children,
  colour = colours.orange,
  primaryBadges,
  secondaryBadges,
  description,
}: PageHeaderProps) => {
  return (
    <div className="flex flex-col gap-1">
      {children}

      {description && <section className="px-2 pb-2">{description}</section>}

      <div className="flex gap-2">
        {primaryBadges?.map((primaryBadge, index) => {
          return primaryBadge.link ? (
            <a
              key={index}
              href={primaryBadge.link}
              target="_blank"
              className={cn(
                "flex flex-row items-center gap-2 px-2 py-0.5 text-sm rounded-full hover:underline",
                colour.backgroundPill,
                colour.textPill
              )}
            >
              {primaryBadge.title}

              <Icon iconName="link" size="sm" />
            </a>
          ) : (
            <h3
              key={index}
              className={cn(
                "px-2 py-0.5 text-sm rounded-full",
                colour.backgroundPill,
                colour.textPill
              )}
            >
              {primaryBadge.title}
            </h3>
          );
        })}

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
