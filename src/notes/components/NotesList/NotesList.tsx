import { Button } from "src/common/components/Button/Button";
import { NoteListItem } from "./NoteListItem";
import type { Colour } from "src/colours/Colour.type";
import type { NotesGroup } from "src/notes/Note.type";

type NotesListProps = {
  noteGroup: NotesGroup;
  createdDateFormat?: string;
  colour: Colour;
};

export const NotesList = ({
  noteGroup,
  createdDateFormat,
  colour,
}: NotesListProps) => {
  return (
    <section id={noteGroup.title ?? undefined}>
      <div className="flex flex-col gap-1 items-start">
        {noteGroup.title && (
          <p className="text-slate-400 text-xs">{noteGroup.title}</p>
        )}

        {noteGroup.notes.map((note) => (
          <NoteListItem
            key={note.id}
            note={note}
            createdDateFormat={createdDateFormat}
            colour={colour}
          />
        ))}
      </div>

      {noteGroup.notes.length === 0 && (
        <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
          <p className="text-slate-500">No notes yet</p>

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            iconName="plusSquare"
          >
            Create your first note
          </Button>
        </div>
      )}
    </section>
  );
};
