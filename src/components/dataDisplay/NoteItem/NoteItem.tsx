import { Flag, PushPin } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { useState } from "react";
import { jumpToDateAtom } from "src/atoms/jumpToDateAtom";
import { Button } from "src/components/controls/Button/Button";
import QuillContentView from "src/components/dataDisplay/QuillContentView/QuillContentView";
import EditNoteModal from "src/components/modals/EditNoteModal/EditNoteModal";
import { colours } from "src/constants/colours.constant";
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
        "flex flex-col gap-0.5 relative p-2 rounded-2xl transition-all"
      )}
    >
      <Dialog.Root>
        {note.title && (
          <Dialog.Trigger asChild>
            <h1 className="text-xl font-medium tracking-tight">{note.title}</h1>
          </Dialog.Trigger>
        )}

        {!isNoteContentEmpty(note.content) && (
          <Dialog.Trigger asChild>
            <span>
              <QuillContentView content={note.content} />
            </span>
          </Dialog.Trigger>
        )}

        <div
          className={cn(
            "flex items-center flex-wrap -ml-2 duration-300 transition-all",
            isHovered ? "gap-1" : "gap-0"
          )}
        >
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
              collapsed={!isHovered}
              onClick={(tagId) => {
                navigate({ to: `/tags/${tagId}` });
              }}
            />
          ))}

          {note.isPinned && (
            <PushPin className="fill-red-400 m-1" weight="fill" size={18} />
          )}

          {note.isFlagged && (
            <Flag className="fill-orange-400 m-1" weight="fill" size={18} />
          )}
        </div>

        <EditNoteModal note={note} />
      </Dialog.Root>
    </div>
  );
};
