import { useMemo } from "react";
import { colours } from "src/colours/colours.constant";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import NoteEditor from "src/notes/components/NoteEditor/NoteEditor";
import { groupNotes } from "src/notes/utils/groupNotes";
import { NotesList } from "../NotesList/NotesList";
import type { Colour } from "src/colours/Colour.type";
import type { Note, NotesGroup } from "src/notes/Note.type";
import type { TagBadge } from "src/tags/Tag.type";

type NotesLayoutProps = {
  title: string;
  colour?: Colour;
  notes: Note[];
  selectedNote: Note | null;
  showNoteCreateTimeOnly?: boolean;
  description: string | null;
  links?: TagBadge[];
  prefillNewNoteData?: Partial<Note>;
  groupNotesBy?: "created" | "tag";
};

export const NotesLayout = ({
  title,
  colour = colours.orange,
  notes,
  selectedNote,
  showNoteCreateTimeOnly = false,
  description,
  links,
  prefillNewNoteData,
  groupNotesBy,
}: NotesLayoutProps) => {
  const noteGroups = useMemo<NotesGroup[]>(() => {
    if (!groupNotesBy) {
      return [
        {
          title: null,
          notes: notes,
          relevantNoteData: prefillNewNoteData ?? {},
        },
      ];
    }
    return groupNotes(notes, groupNotesBy, title, prefillNewNoteData ?? {});
  }, [notes, groupNotesBy, title, prefillNewNoteData]);

  // FIXME: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full w-full min-w-0 pb-16 flex">
      <div className="h-full w-80 px-6 flex flex-col gap-6 overflow-y-scroll border-r-2 border-slate-100">
        {(description ?? links) && (
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col gap-2">
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}

            {links &&
              links.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  className={cn(
                    "flex flex-row items-center gap-2 text-sm rounded-full hover:underline",
                    colour.text,
                  )}
                >
                  <Icon iconName="link" size="sm" />
                  {link.title}
                </a>
              ))}
          </div>
        )}

        {noteGroups.map((noteGroup) => (
          <NotesList
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

      <div className="h-full w-full p-12 flex justify-center overflow-y-scroll">
        {selectedNote ? (
          <NoteEditor note={selectedNote} colour={colour} />
        ) : (
          <p>Select a note to view it here.</p>
        )}
      </div>
    </div>
  );
};
