import { useSetAtom } from "jotai";
import { isSideBarVisibleAtom } from "src/atoms/isSidebarVisibleAtom";
import { Button } from "src/components/controls/Button/Button";
import { useGetTags } from "src/hooks/tags/useGetTags";
import { cn } from "src/utils/cn";
import { NavItem } from "../NavItem/NavItem";
import { Calendar } from "../navigation/Calendar/Calendar";

export const Sidebar = () => {
  const { tags } = useGetTags();

  const setIsSidebarVisible = useSetAtom(isSideBarVisibleAtom);

  return (
    <aside className="p-3 bg-slate-50 min-w-60">
      <div
        className={cn(
          "flex flex-col flex-shrink-0 justify-between gap-3 h-full"
        )}
      >
        <div className="flex flex-col gap-3 justify-between overflow-y-auto">
          <div className="flex flex-row items-center justify-between gap-2">
            <h1 className="font-title text-slate-500 text-xl">Adjourn</h1>

            <Button
              variant="ghost"
              onClick={() => setIsSidebarVisible(false)}
              iconName="arrowLineLeft"
            />
          </div>

          <section className="flex flex-col gap-1">
            <NavItem
              ghost
              iconName="calendarDots"
              title="Planner"
              to="/planner/"
              expanded={true}
            />

            <NavItem
              ghost
              iconName="listChecks"
              title="Tasks"
              to="/tasks/"
              expanded={true}
            />

            <NavItem
              ghost
              iconName="flag"
              title={"Flagged"}
              to={`/flagged/`}
              expanded={true}
            />
          </section>

          <section className="flex flex-col gap-1">
            <h1 className="font-title text-slate-400 text-md">Tags</h1>

            {tags.map((tag) => (
              <NavItem
                iconName={tag.icon}
                colour={tag.colour}
                title={tag.name}
                preview={tag.slipCount}
                to={`/tags/${tag.id}`}
                expanded={true}
              />
            ))}
          </section>
        </div>

        <Calendar />
      </div>
    </aside>
  );
};
