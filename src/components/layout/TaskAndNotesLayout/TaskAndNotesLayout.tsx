import * as Dialog from "@radix-ui/react-dialog";
import { useState, useRef, useMemo } from "react";
import { Button } from "src/components/controls/Button/Button";
import { NoteItem } from "src/components/dataDisplay/NoteItem/NoteItem";
import { TaskItem } from "src/components/dataDisplay/TaskItem/TaskItem";
import { PageHeader } from "src/components/layout/PageHeader/PageHeader";
import EditNoteModal from "src/components/modals/EditNoteModal/EditNoteModal";
import TableOfContents from "src/components/navigation/TableOfContents/TableOfContents";
import { colours } from "src/constants/colours.constant";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import { useTaskAndNotesTOCItems } from "src/hooks/useTaskAndNotesTOCItems";
import { groupNotes } from "src/utils/notes/groupNotes";
import type { Colour } from "src/types/Colour.type";
import type { Note, NotesGroup } from "src/types/Note.type";
import type { Task } from "src/types/Task.type";

type TaskAndNotesLayoutProps = {
  header: React.ReactNode;
  title: string;
  colour?: Colour;
  primaryBadges?: string[];
  secondaryBadges?: string[];
  tasks: Task[];
  notes: Note[];
  showNoteCreateTimeOnly?: boolean;
  description?: React.ReactNode;
  prefillNewNoteData?: Partial<Note>;
  groupNotesBy?: "created" | "tag" | null;
  defaultNoteGroupTitle?: string;
};

export const TaskAndNotesLayout = ({
  header,
  title,
  colour = colours.orange,
  primaryBadges = [],
  secondaryBadges = [],
  tasks,
  notes,
  showNoteCreateTimeOnly = false,
  description,
  prefillNewNoteData,
  groupNotesBy = null,
  defaultNoteGroupTitle,
}: TaskAndNotesLayoutProps) => {
  const noteRefs = useRef<HTMLDivElement[]>([]);
  const [navigationId, setNavigationId] = useState("");
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  useIntersectionObserver(
    noteRefs,
    (entry) => {
      setNavigationId(entry.target.id);
    },
    { rootMargin: "-10% 0% -90% 0%" },
    { disabled: false }
  );

  const noteGroups = useMemo<NotesGroup[]>(() => {
    if (!groupNotesBy) {
      return [
        {
          title: "Notes",
          notes: notes,
          relevantNoteData: prefillNewNoteData ?? {},
        },
      ];
    }
    return groupNotes(
      notes,
      groupNotesBy,
      groupNotesBy === "tag" ? defaultNoteGroupTitle : undefined,
      prefillNewNoteData ?? {}
    );
  }, [notes, groupNotesBy, defaultNoteGroupTitle, prefillNewNoteData]);

  const tableOfContentItems = useTaskAndNotesTOCItems(noteGroups);

  // TODO: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full max-w-[1000px] w-full min-w-0 pb-16 flex items-center">
      <div className="h-full w-full p-12 flex flex-col gap-10 overflow-y-scroll">
        <PageHeader
          colour={colour}
          primaryBadges={primaryBadges}
          secondaryBadges={secondaryBadges}
        >
          {header}
        </PageHeader>

        {description && <section className="px-2">{description}</section>}

        <section id="Tasks">
          <div className="flex gap-2 p-2">
            <h2 className="text-slate-400 font-title text-2xl">Tasks</h2>

            <div className="mb-2">
              <Button
                variant="ghost-strong"
                className="w-full"
                iconName="plus"
                size="sm"
                onClick={() => {}}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-1">
            {tasks.length === 0 && (
              <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
                <p className="text-slate-500">No tasks yet</p>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    iconName="plusSquare"
                    onClick={() => {}}
                  >
                    Create your first task
                  </Button>
                </div>
              </div>
            )}

            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} colour={colour} />
            ))}
          </div>
        </section>

        {noteGroups.map((noteGroup) => (
          <section id={noteGroup.title}>
            <Dialog.Root>
              <div className="flex gap-2 p-2">
                <h2 className="text-slate-400 font-title text-2xl">
                  {noteGroup.title}
                </h2>

                <Dialog.Trigger asChild>
                  <div className="mb-2">
                    <Button
                      variant="ghost-strong"
                      className="w-full"
                      iconName="plus"
                      size="sm"
                      onClick={() => setShowEditNoteModal(true)}
                    />
                  </div>
                </Dialog.Trigger>
              </div>

              {noteGroup.notes.length === 0 && (
                <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
                  <p className="text-slate-500">No notes yet</p>

                  <Dialog.Trigger asChild>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        iconName="plusSquare"
                        onClick={() => setShowEditNoteModal(true)}
                      >
                        Create your first note
                      </Button>
                    </div>
                  </Dialog.Trigger>
                </div>
              )}

              <div className="flex flex-col gap-5">
                {noteGroup.notes.map((note) => (
                  <NoteItem
                    ref={(el: HTMLDivElement | null) => {
                      if (el && !noteRefs.current.includes(el)) {
                        noteRefs.current.push(el);
                      }
                    }}
                    createdDateFormat={
                      showNoteCreateTimeOnly || groupNotesBy === "created"
                        ? "h:mm a"
                        : undefined
                    }
                    colour={colour}
                    note={note}
                  />
                ))}
              </div>

              {showEditNoteModal && (
                <EditNoteModal
                  note={noteGroup.relevantNoteData}
                  onSave={() => {
                    setShowEditNoteModal(false);
                  }}
                />
              )}
            </Dialog.Root>
          </section>
        ))}
      </div>

      <div className="flex flex-col justify-center">
        <TableOfContents
          title={title}
          items={tableOfContentItems}
          colour={colour}
          activeItemNavigationId={navigationId}
          onJumpTo={(id) => setNavigationId(id)}
        />
      </div>
    </div>
  );
};
