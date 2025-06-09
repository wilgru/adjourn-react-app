import { PushPin, Flag } from "@phosphor-icons/react";
import type { Note } from "src/types/Note.type";

type NoteItemHeadingProps = {
  note: Note;
};

export const NoteItemHeading = ({ note }: NoteItemHeadingProps) => {
  if (!note.title && !note.isPinned && !note.isFlagged) {
    return;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 items-baseline">
        {note.title && (
          <h1 className="font-title text-3xl font-normal tracking-tight">
            {note.title}
          </h1>
        )}

        {note.isPinned && (
          <PushPin weight="fill" className="w-5 h-5 text-red-400" />
        )}

        {note.isFlagged && (
          <Flag weight="fill" className="w-5 h-5 text-orange-400" />
        )}
      </div>
    </div>
  );
};
