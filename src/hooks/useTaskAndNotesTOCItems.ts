import { useMemo } from "react";
import { groupSlips } from "src/utils/slips/groupSlips";
import type { TableOfContentsItem } from "src/components/TableOfContents/TableOfContents";
import type { Slip } from "src/types/Slip.type";
import type { Task } from "src/types/Task.type";

export const useTaskAndNotesTOCItems = (
  tasks: Task[],
  notes: Slip[],
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
      ? groupSlips(notes, groupBy, groupBy === "tag" ? tagName : undefined)
      : [
          {
            title: "Notes",
            slips: notes,
          },
        ];

    const noteItems = noteGroups.map((noteGroup) => {
      return {
        title: noteGroup.title,
        navigationId: null,
        subItems: noteGroup.slips.map((note) => {
          let noteTitle = note.title;

          if (!noteTitle && typeof note.content.ops[0].insert === "string") {
            noteTitle = note.content.ops[0].insert;
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
