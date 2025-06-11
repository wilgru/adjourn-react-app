import { PushPin, Flag } from "@phosphor-icons/react";
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
        <h1 className="font-title text-2xl font-normal tracking-tight">
          {note.title}
        </h1>
      )}

      {!isNoteContentEmpty(note.content) && (
        <QuillContentView content={note.content} />
      )}

      <div className="flex items-center flex-wrap">
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

        {note.isPinned && (
          <PushPin weight="fill" className="w-5 h-4 mr-1 text-red-400" />
        )}

        {note.isFlagged && (
          <Flag weight="fill" className="w-5 h-4 mr-1 text-orange-400" />
        )}
      </div>

      {/* left side quick actions */}
      <div
        hidden={!isHovered}
        className="absolute p-2 -left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex flex-col gap-2 p-1 bg-white border border-slate-300 rounded-full drop-shadow-md">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                colour={colour}
                iconName="pencil"
                variant="ghost"
                size="sm"
              />
            </Dialog.Trigger>

            <Toggle
              onClick={() => {
                updateNote({
                  noteId: note.id,
                  updateNoteData: {
                    ...note,
                    isFlagged: !note.isFlagged,
                  },
                });
              }}
              isToggled={note.isFlagged}
              iconName="flag"
              size="sm"
            />

            <Button
              onClick={() => {
                deleteNote({ noteId: note.id });
              }}
              colour={colours.red}
              iconName="trash"
              variant="ghost"
              size="sm"
            />

            <EditNoteModal note={note} />
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
};
