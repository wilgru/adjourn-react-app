import { useState, useMemo } from "react";
import { PageHeader } from "src/components/dataDisplay/PageHeader/PageHeader";
import TableOfContents from "src/components/navigation/TableOfContents/TableOfContents";
import { colours } from "src/constants/colours.constant";
import { useTaskAndNotesTOCItems } from "src/hooks/useTaskAndNotesTOCItems";
import { groupNotes } from "src/utils/notes/groupNotes";
import { NotesSection } from "../../dataDisplay/NotesSection/NotesSection";
import { TasksSection } from "../../dataDisplay/TasksSection/TasksSection";
import type { Colour } from "src/types/Colour.type";
import type { Note, NotesGroup } from "src/types/Note.type";
import type { Task } from "src/types/Task.type";

type TaskAndNotesLayoutProps = {
  header: React.ReactNode;
  title: string;
  colour?: Colour;
  badges?: string[];
  tasks: Task[];
  notes: Note[];
  showNoteCreateTimeOnly?: boolean;
  description?: string;
  prefillNewTaskData?: Partial<Task>;
  prefillNewNoteData?: Partial<Note>;
  groupNotesBy?: "created" | "tag";
};

export const TaskAndNotesLayout = ({
  header,
  title,
  colour = colours.orange,
  badges = [],
  tasks,
  notes,
  showNoteCreateTimeOnly = false,
  description,
  prefillNewTaskData,
  prefillNewNoteData,
  groupNotesBy,
}: TaskAndNotesLayoutProps) => {
  const [navigationId, setNavigationId] = useState("");

  // for this layout, we'll only show one task group that contains all the tasks no matter what
  const taskGroup = useMemo(() => {
    return {
      title: "Tasks",
      tasks: tasks,
      relevantTaskData: prefillNewTaskData ?? {},
    };
  }, [tasks, prefillNewTaskData]);

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
    return groupNotes(notes, groupNotesBy, title, prefillNewNoteData ?? {});
  }, [notes, groupNotesBy, title, prefillNewNoteData]);

  const secondaryBadges = useMemo(() => {
    return [`${tasks.length} tasks`, `${notes.length} notes`];
  }, [notes.length, tasks.length]);

  const tableOfContentItems = useTaskAndNotesTOCItems(noteGroups);

  // FIXME: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full max-w-[1000px] w-full min-w-0 pb-16 flex items-center">
      <div className="h-full w-full p-12 flex flex-col gap-14 overflow-y-scroll">
        <PageHeader
          colour={colour}
          primaryBadges={badges}
          secondaryBadges={secondaryBadges}
          description={description}
        >
          {header}
        </PageHeader>

        <TasksSection taskGroup={taskGroup} colour={colour} />

        {noteGroups.map((noteGroup) => (
          <NotesSection
            noteGroup={noteGroup}
            colour={colour}
            createdDateFormat={
              showNoteCreateTimeOnly || groupNotesBy === "created"
                ? "h:mm a"
                : undefined
            }
          />
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
