import { useSetAtom } from "jotai";
import { isSideBarVisibleAtom } from "src/atoms/isSidebarVisibleAtom";
import { Button } from "src/components/controls/Button/Button";
import { useGetJournals } from "src/hooks/journals/useGetJournals";
import { cn } from "src/utils/cn";
import { NavItem } from "../NavItem/NavItem";

export const Sidebar = () => {
  const { journals } = useGetJournals();

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
              iconName="calendarDot"
              title="Today"
              to="/day/"
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

          <section className="flex flex-col gap-1 p-1">
            <h1 className="font-title text-slate-400 text-md ml-2">Tags</h1>

            {journals.map((journal) => (
              <NavItem
                iconName={journal.icon}
                colour={journal.colour}
                title={journal.name}
                preview={journal.slipCount}
                to={`/journals/${journal.id}`}
                expanded={true}
              />
            ))}
          </section>
        </div>
      </div>
    </aside>
  );
};
