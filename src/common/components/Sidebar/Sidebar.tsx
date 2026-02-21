import * as Dialog from "@radix-ui/react-dialog";
import { useSetAtom } from "jotai";
import { isSideBarVisibleAtom } from "src/common/atoms/isSidebarVisibleAtom";
import { Button } from "src/common/components/Button/Button";
import { NavItem } from "src/common/components/NavItem/NavItem";
import { getNavigationDay } from "src/common/utils/getNavigationDay";
import { JournalSelector } from "src/journals/components/JournalSelector/JouranlSelector";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { useGetJournals } from "src/journals/hooks/useGetJournals";
import { CreateTopicGroupModal } from "src/tags/components/CreateTopicGroupModal/CreateTopicGroupModal";
import { useGetTopicGroups } from "src/tags/hooks/useGetTopicGroups";
import { SidebarTagSection } from "./SidebarTagSection";

export const Sidebar = () => {
  const { journalId } = useCurrentJournalId();
  const { ungroupedTopics, topicGroups } = useGetTopicGroups();
  const { journals } = useGetJournals();

  const currentJournal = journals.find((journal) => journal.id === journalId);

  const setIsSidebarVisible = useSetAtom(isSideBarVisibleAtom);

  if (!journalId || !currentJournal) {
    return <div>Error trying to load journal...</div>; // TODO: handle this better, use a loading state or a message indicating no journal is selected
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
              iconName="notebook"
              title="Logbook"
              to={`/${journalId}/logbook/${getNavigationDay()}`}
              expanded={true}
            />

            <NavItem
              ghost
              iconName="pencil"
              title="Notes"
              to={`/${journalId}/notes/`}
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

          <SidebarTagSection title={"Tags"}>
            {ungroupedTopics.map((tag) => (
              <NavItem
                iconName={tag.icon}
                colour={tag.colour}
                title={tag.name}
                preview={tag.noteCount}
                to={`/${journalId}/tags/${tag.id}`}
                expanded={true}
              />
            ))}
          </SidebarTagSection>

          {topicGroups.map((topicGroup) => (
            <SidebarTagSection
              title={topicGroup.title}
              topicGroupId={topicGroup.id}
              key={topicGroup.id}
            >
              <div className="flex flex-col gap-1 mt-1">
                {topicGroup.topics.map((tag) => (
                  <NavItem
                    iconName={tag.icon}
                    colour={tag.colour}
                    title={tag.name}
                    preview={tag.noteCount}
                    to={`/${journalId}/tags/${tag.id}`}
                    expanded={true}
                  />
                ))}
              </div>
            </SidebarTagSection>
          ))}

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                className="mt-1"
                variant="ghost-strong"
                size="sm"
                iconName="plus"
              >
                Add section
              </Button>
            </Dialog.Trigger>

            <CreateTopicGroupModal />
          </Dialog.Root>
        </div>
      </div>
    </aside>
  );
};
