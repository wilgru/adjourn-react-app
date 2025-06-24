import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { EditTaskModal } from "src/components/modals/EditTaskModal/EditTaskModal";
import type { Colour } from "src/types/Colour.type";
import type { Note } from "src/types/Note.type";
import type { SharedFields } from "src/types/SharedFields.type";
import type { Task } from "src/types/Task.type";

type EmptyTasksSectionProps = {
  colour: Colour;
  relevantData?: SharedFields<Note, Task>;
};

export const EmptyTasksSection = ({
  colour,
  relevantData,
}: EmptyTasksSectionProps) => {
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 p-1">
      <Dialog.Root>
        <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
          <p className="text-slate-500">No tasks yet</p>

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
                Create your first task
              </Button>
            </div>
          </Dialog.Trigger>
        </div>

        {showEditNoteModal && (
          <EditTaskModal
            task={relevantData}
            onSave={() => {
              setShowEditNoteModal(false);
            }}
          />
        )}
      </Dialog.Root>
    </div>
  );
};
