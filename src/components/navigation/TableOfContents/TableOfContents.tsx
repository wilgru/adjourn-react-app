import { useNavigate } from "@tanstack/react-router";
import { colours } from "src/constants/colours.constant";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";

export type TableOfContentsItem = {
  title: string;
  navigationId: string | null;
  italic?: boolean;
};

type TableOfContentsProps = {
  title: string;
  items: TableOfContentsItem[];
  activeItemNavigationId: string;
  onJumpTo: (id: string) => void;
  colour?: Colour;
};

const TableOfContentsListItem = ({
  item,
  isActive,
  onJumpTo,
  colour,
}: {
  item: TableOfContentsItem;
  onJumpTo: (id: string) => void;
  isActive: boolean;
  colour: Colour;
}) => {
  const navigate = useNavigate();

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
    </li>
  );
};

export default function TableOfContents({
  title,
  items,
  activeItemNavigationId,
  onJumpTo,
  colour = colours.orange,
}: TableOfContentsProps) {
  return (
    <ul className="w-40 m-4 pl-2 pb-2 h-fit opacity-60 hover:opacity-100 transition-opacity">
      <li>
        <h2
          className={cn(
            "font-title text-lg pt-1 px-3 overflow-x-hidden whitespace-nowrap overflow-ellipsis cursor-pointer rounded-full overflow-clip transition-color",
            // isActive && colour.backgroundPill,
            // isActive && colour.textPill,
            colour.backgroundPillInverted,
            colour.textPillInverted
          )}
        >
          {title}
        </h2>
      </li>

      {items.map((item) => (
        <TableOfContentsListItem
          key={item.navigationId}
          item={item}
          colour={colour}
          isActive={activeItemNavigationId === item.navigationId}
          onJumpTo={onJumpTo}
        />
      ))}
    </ul>
  );
}
