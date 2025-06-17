import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { jumpToDateAtom } from "src/atoms/jumpToDateAtom";
import { Button } from "src/components/controls/Button/Button";
import { Toggle } from "src/components/controls/Toggle/Toggle";
import QuillContentView from "src/components/dataDisplay/QuillContentView/QuillContentView";
import EditNoteModal from "src/components/modals/EditNoteModal/EditNoteModal";
import { colours } from "src/constants/colours.constant";
import { useDeleteNote } from "src/hooks/notes/useDeleteNote";
import { useUpdateNote } from "src/hooks/notes/useUpdateNote";
import { cn } from "src/utils/cn";
import { getNavigationDay } from "src/utils/getNavigationDay";
import { isNoteContentEmpty } from "src/utils/notes/isNoteContentEmpty";
import { TagPill } from "../TagPill/TagPill";
import type { Colour } from "src/types/Colour.type";
import type { Note } from "src/types/Note.type";

type NoteItemProps = {
  note: Note;
  createdDateFormat?: string;
  colour?: Colour;
};

export const NoteItem = ({
  note,
  createdDateFormat = "ddd MMM D, YYYY",
  colour = colours.orange,
}: NoteItemProps) => {
  const navigate = useNavigate();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();
  const setJumpToAtom = useSetAtom(jumpToDateAtom);
  const [isHovered, setIsHovered] = useState(false);

  // TODO: would it be more efficient to use the edit modal in the section rather than on each item?
  return (
    <div
      id={note.id}
      key={note.id}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex flex-col gap-0.5 relative p-2 rounded-2xl transition-colors",
        colour.backgroundGlow
      )}
    >
      {note.title && (
        <h1 className="text-xl font-normal tracking-tight">{note.title}</h1>
      )}

      {!isNoteContentEmpty(note.content) && (
        <QuillContentView content={note.content} />
      )}

      <div className="flex items-center gap-1 flex-wrap -ml-2">
        <Button
          colour={colour}
          variant="ghost"
          size="sm"
          onClick={() => {
            navigate({ to: `/planner/${getNavigationDay(note.created)}` });
            setJumpToAtom(note.created);
          }}
        >
          {note.created.format(createdDateFormat)}
        </Button>

        {note.tags.map((tag) => (
          <TagPill
            key={tag.id}
            tag={tag}
            size="sm"
            variant="ghost"
            closable={false}
            onClick={(tagId) => {
              navigate({ to: `/tags/${tagId}` });
            }}
          />
        ))}

        {(note.isPinned || isHovered) && (
          <Toggle
            colour={colours.red}
            isToggled={note.isPinned}
            size="sm"
            onClick={() =>
              updateNote({
                noteId: note.id,
                updateNoteData: {
                  ...note,
                  isPinned: !note.isPinned,
                },
              })
            }
            iconName="pushPin"
          />
        )}

        {(note.isFlagged || isHovered) && (
          <Toggle
            isToggled={note.isFlagged}
            size="sm"
            onClick={() =>
              updateNote({
                noteId: note.id,
                updateNoteData: {
                  ...note,
                  isFlagged: !note.isFlagged,
                },
              })
            }
            iconName="flag"
          />
        )}

        <Dialog.Root>
          {isHovered && (
            <Dialog.Trigger asChild>
              <Button
                colour={colour}
                iconName="pencil"
                variant="ghost"
                size="sm"
              />
            </Dialog.Trigger>
          )}

          <EditNoteModal note={note} />
        </Dialog.Root>

        {isHovered && (
          <Button
            onClick={() => {
              deleteNote({ noteId: note.id });
            }}
            colour={colours.red}
            iconName="trash"
            variant="ghost"
            size="sm"
          />
        )}
      </div>
    </div>
  );
};
