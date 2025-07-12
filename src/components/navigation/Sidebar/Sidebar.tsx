import { useParams } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { isSideBarVisibleAtom } from "src/atoms/isSidebarVisibleAtom";
import { Button } from "src/components/controls/Button/Button";
import { JournalSelector } from "src/components/dataEntry/JournalSelector/JouranlSelector";
import { Calendar } from "src/components/navigation/Calendar/Calendar";
import { NavItem } from "src/components/navigation/NavItem/NavItem";
import { useGetJournals } from "src/hooks/journals/useGetJournals";
import { useGetTags } from "src/hooks/tags/useGetTags";

export const Sidebar = () => {
  const { journalId } = useParams({ strict: false }); // {strict: false} option means that you want to access the params from an ambiguous location
  const { tags } = useGetTags();
  const { journals } = useGetJournals();

  const currentJournal = journals.find((journal) => journal.id === journalId);

  const setIsSidebarVisible = useSetAtom(isSideBarVisibleAtom);

  console.log("Sidebar currentJournal", journals, currentJournal);

  if (!journalId || !currentJournal) {
    return null; // or a loading state, or a message indicating no journal is selected
  }

  return (
    <aside className="p-3 bg-slate-50 min-w-60">
      <div className="flex flex-col flex-shrink-0 justify-between gap-3 h-full">
        <div className="flex flex-col gap-3 justify-between overflow-y-auto">
          <div className="flex flex-row items-center justify-between gap-2">
            <h1 className="font-title text-slate-500 text-xl">Adjourn</h1>

            <Button
              variant="ghost"
              onClick={() => setIsSidebarVisible(false)}
              iconName="arrowLineLeft"
            />
          </div>

          <JournalSelector
            currentJournal={currentJournal}
            journals={journals}
          />

          <section className="flex flex-col gap-1">
            <NavItem
              ghost
              iconName="calendarDots"
              title="Planner"
              to={`/${journalId}/planner/`}
              expanded={true}
            />

            <NavItem
              ghost
              iconName="listChecks"
              title="Tasks"
              to={`/${journalId}/tasks/`}
              expanded={true}
            />

            <NavItem
              ghost
              iconName="flag"
              title={"Flagged"}
              to={`/${journalId}/flagged/`}
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
                preview={tag.noteCount}
                to={`/${journalId}/tags/${tag.id}`}
                expanded={true}
              />
            ))}
          </section>
        </div>

        <Calendar journalId={journalId} />
      </div>
    </aside>
  );
};
