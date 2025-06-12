import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { NoteItem } from "src/components/dataDisplay/NoteItem/NoteItem";
import EditNoteModal from "src/components/modals/EditNoteModal/EditNoteModal";
import type { Colour } from "src/types/Colour.type";
import type { NotesGroup } from "src/types/Note.type";

type NotesSectionProps = {
  noteGroup: NotesGroup;
  createdDateFormat?: string;
  colour: Colour;
};

export const NotesSection = ({
  noteGroup,
  createdDateFormat,
  colour,
}: NotesSectionProps) => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  return (
    <section id={noteGroup.title}>
      <Dialog.Root>
        <div
          className="flex gap-2 p-2"
          onMouseOver={() => setIsTitleHovered(true)}
          onMouseLeave={() => setIsTitleHovered(false)}
        >
          <h2 className="text-slate-400 font-title text-3xl">
            {noteGroup.title}
          </h2>

          <Dialog.Trigger asChild>
            {isTitleHovered && (
              <div className="mb-2">
                <Button
                  variant="ghost-strong"
                  className="w-full"
                  iconName="plus"
                  size="sm"
                  onClick={() => setShowEditNoteModal(true)}
                />
              </div>
            )}
          </Dialog.Trigger>
        </div>

        {noteGroup.notes.length === 0 && (
          <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
            <p className="text-slate-500">No notes yet</p>

            <Dialog.Trigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  iconName="plusSquare"
                  onClick={() => setShowEditNoteModal(true)}
                >
                  Create your first note
                </Button>
              </div>
            </Dialog.Trigger>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {noteGroup.notes.map((note) => (
            <NoteItem
              createdDateFormat={createdDateFormat}
              colour={colour}
              note={note}
            />
          ))}
        </div>

        {showEditNoteModal && (
          <EditNoteModal
            note={noteGroup.relevantNoteData}
            onSave={() => {
              setShowEditNoteModal(false);
            }}
          />
        )}
      </Dialog.Root>
    </section>
  );
};
