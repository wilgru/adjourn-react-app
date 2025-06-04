import { useNavigate } from "@tanstack/react-router";
import { colours } from "src/constants/colours.constant";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";

export type TableOfContentsItem = {
  title: string;
  navigationId: string | null;
  italic?: boolean;
  subItems: TableOfContentsItem[];
};

type TableOfContentsProps = {
  title: string;
  items: TableOfContentsItem[];
  activeItemNavigationId: string;
  onJumpTo: (id: string) => void;
  colour?: Colour;
};

export default function TableOfContents({
  title,
  items,
  activeItemNavigationId,
  onJumpTo,
  colour = colours.orange,
}: TableOfContentsProps) {
  const navigate = useNavigate();

  const NavigatableLi = ({ item }: { item: TableOfContentsItem }) => {
    const isActive = item.navigationId === activeItemNavigationId;

    return (
      <li
        key={item.title}
        onClick={() => {
          item.navigationId && onJumpTo(item.navigationId);
          navigate({ to: `#${item.navigationId}` });
        }}
      >
        <h2
          className={cn(
            "text-sm py-1 px-3 overflow-x-hidden whitespace-nowrap overflow-ellipsis cursor-pointer rounded-full overflow-clip transition-colors",
            item.italic && "italic",
            isActive && colour.backgroundPill,
            isActive && colour.textPill,
            colour.backgroundPillInverted,
            colour.textPillInverted
          )}
        >
          {item.title}
        </h2>

        <ul>
          {item.subItems.map((subItem) => {
            const isNavigatable = !!subItem.navigationId;

            return isNavigatable ? (
              <NavigatableLi item={subItem} />
            ) : (
              <StaticLi item={subItem} />
            );
          })}
        </ul>
      </li>
    );
  };

  const StaticLi = ({ item }: { item: TableOfContentsItem }) => {
    return (
      <li key={item.title}>
        <h2
          className={cn(
            "px-3 pt-3 text-slate-400 text-xs overflow-x-hidden whitespace-nowrap overflow-ellipsis",
            item.italic && "italic"
          )}
        >
          {item.title}
        </h2>

        <ul>
          {item.subItems.map((subItem) => {
            const isNavigatable = !!subItem.navigationId;

            return isNavigatable ? (
              <NavigatableLi item={subItem} />
            ) : (
              <StaticLi item={subItem} />
            );
          })}
        </ul>
      </li>
    );
  };

  return (
    <ul className="w-60 m-4 pl-2 pb-2  h-fit opacity-60 hover:opacity-100 transition-opacity">
      <li>
        <h2
          className={cn(
            "font-title text-lg pt-1 px-2 overflow-x-hidden whitespace-nowrap overflow-ellipsis cursor-pointer rounded-full overflow-clip transition-color",
            // isActive && colour.backgroundPill,
            // isActive && colour.textPill,
            colour.backgroundPillInverted,
            colour.textPillInverted
          )}
        >
          {title}
        </h2>
      </li>

      {items.map((item) => {
        const isNavigatable = !!item.navigationId;

        return isNavigatable ? (
          <NavigatableLi item={item} />
        ) : (
          <StaticLi item={item} />
        );
      })}
    </ul>
  );
}
