import { useMemo } from "react";
import { NoteItem } from "src/components/dataDisplay/NoteItem/NoteItem";
import { TaskItem } from "src/components/dataDisplay/TaskItem/TaskItem";
import { EmptyNotesSection } from "src/components/layout/NotesSection/EmptyNotesSection";
import { EmptyTasksSection } from "src/components/layout/TasksSection/EmptyTasksSection";
import { colours } from "src/constants/colours.constant";
import { groupNotes } from "src/utils/notes/groupNotes";
import type { SectionalLayoutSection } from "src/components/layout/SectionalLayout/SectionalLayout";
import type { Colour } from "src/types/Colour.type";
import type { Note } from "src/types/Note.type";
import type { SharedFields } from "src/types/SharedFields.type";
import type { Task } from "src/types/Task.type";

type useGetSectionData = {
  tasks: Task[];
  notes: Note[];
  groupBy?: "tag" | "created" | null;
  relevantData?: SharedFields<Note, Task>;
  colour?: Colour;
};

export const useGetSectionData = ({
  tasks,
  notes,
  groupBy = null,
  relevantData = {},
  colour = colours.orange,
}: useGetSectionData): SectionalLayoutSection<Note | Task>[] => {
  const sections = useMemo(() => {
    const groupedNotes = groupNotes(notes, groupBy, undefined, relevantData);

    const taskSection = {
      title: "Tasks",
      prefillNewData: relevantData,
      children:
        tasks.length > 0 ? (
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <TaskItem task={task} key={task.id} />
            ))}
          </div>
        ) : (
          <EmptyTasksSection colour={colour} relevantData={relevantData} />
        ),
    };

    let noteSections: SectionalLayoutSection<Note>[];
    if (groupedNotes.length > 0) {
      noteSections = groupedNotes.map((group) => ({
        title: group.title,
        prefillNewData: group.relevantNoteData,
        children: (
          <div className="flex flex-col gap-6">
            {group.notes.map((note) => (
              <NoteItem note={note} key={note.id} />
            ))}
          </div>
        ),
      }));
    } else {
      noteSections = [
        {
          title: "Notes",
          prefillNewData: relevantData,
          children: (
            <EmptyNotesSection colour={colour} relevantData={relevantData} />
          ),
        },
      ];
    }

    return [taskSection, ...noteSections];
  }, [notes, groupBy, relevantData, tasks, colour]);

  return sections;
};
