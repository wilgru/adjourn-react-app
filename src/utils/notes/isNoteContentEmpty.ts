import type Delta from "quill-delta";

export const isNoteContentEmpty = (NoteContent: Delta): boolean => {
  return (
    !NoteContent.length() || !NoteContent.ops.some((op) => op.insert !== "\n")
  );
};
