import { useMemo } from "react";
import { groupNotes } from "src/utils/notes/groupNotes";
import type { TableOfContentsItem } from "src/components/TableOfContents/TableOfContents";
import type { Note } from "src/types/Note.type";
import type { Task } from "src/types/Task.type";

export const useTaskAndNotesTOCItems = (
  tasks: Task[],
  notes: Note[],
  groupBy: "created" | "tag" | null = null,
  tagName?: string
): TableOfContentsItem[] => {
  return useMemo(() => {
    const taskItems = tasks.map((task) => {
      return {
        title: task.title || "Untitled Task",
        navigationId: task.id,
        subItems: [],
      };
    });

    const noteGroups = groupBy
      ? groupNotes(notes, groupBy, groupBy === "tag" ? tagName : undefined, {})
      : [
          {
            title: "Notes",
            notes: notes,
          },
        ];

    const noteItems = noteGroups.map((noteGroup) => {
      return {
        title: noteGroup.title,
        navigationId: null,
        subItems: noteGroup.notes.map((note) => {
          let noteTitle = note.title;

          if (
            !noteTitle &&
            typeof note.content.ops.at(0)?.insert === "string"
          ) {
            noteTitle = note.content.ops.at(0)?.insert as string; // TODO: will eventially get rid of this when TOC only shows heading and not note names anymore
          }

          return {
            title: noteTitle || "Untitled Note",
            navigationId: note.id,
            italic: !note.title,
            subItems: [],
          };
        }),
      };
    });

    return [
      ...(taskItems.length > 0
        ? [
            {
              title: "Tasks",
              navigationId: null,
              subItems: taskItems,
            },
          ]
        : []),
      ...(noteItems.length > 0 ? noteItems : []),
    ];
  }, [groupBy, notes, tagName, tasks]);
};
