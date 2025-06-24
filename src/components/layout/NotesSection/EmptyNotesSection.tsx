import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import EditNoteModal from "src/components/modals/EditNoteModal/EditNoteModal";
import type { Colour } from "src/types/Colour.type";
import type { Note } from "src/types/Note.type";
import type { Task } from "src/types/Task.type";

type NotesSectionProps = {
  colour: Colour;
  relevantData?: Partial<Note | Task>;
};

export const EmptyNotesSection = ({
  colour,
  relevantData,
}: NotesSectionProps) => {
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  return (
    <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
      <Dialog.Root>
        <p className="text-slate-500">No notes yet</p>

        <Dialog.Trigger asChild>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              iconName="plusSquare"
              colour={colour}
              onClick={() => setShowEditNoteModal(true)}
            >
              Create your first note
            </Button>
          </div>
        </Dialog.Trigger>

        {showEditNoteModal && (
          <EditNoteModal
            note={relevantData}
            onSave={() => {
              setShowEditNoteModal(false);
            }}
          />
        )}
      </Dialog.Root>
    </div>
  );
};
