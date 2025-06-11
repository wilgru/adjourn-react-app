import { useMemo } from "react";
import type { NotesGroup } from "src/types/Note.type";
import type { TableOfContentsItem } from "src/types/TableOfContentsItem.type";

export const useTaskAndNotesTOCItems = (
  noteGroups: NotesGroup[]
): TableOfContentsItem[] => {
  return useMemo(() => {
    const taskTOCItem = {
      title: "Tasks",
      navigationId: "Tasks",
    };

    const noteTOCItems = noteGroups.map((noteGroup) => {
      return {
        title: noteGroup.title,
        navigationId: noteGroup.title,
      };
    });

    return [taskTOCItem, ...noteTOCItems];
  }, [noteGroups]);
};
