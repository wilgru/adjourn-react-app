import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { TaskItem } from "src/components/dataDisplay/TaskItem/TaskItem";
import { EditTaskModal } from "src/components/modals/EditTaskModal/EditTaskModal";
import type { Colour } from "src/types/Colour.type";
import type { TasksGroup } from "src/types/Task.type";

type TasksSectionProps = {
  taskGroup: TasksGroup;
  colour: Colour;
};

export const TasksSection = ({ taskGroup, colour }: TasksSectionProps) => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  return (
    <section id="Tasks">
      <Dialog.Root>
        <div
          className="flex p-2 gap-2 items-center"
          onMouseOver={() => setIsTitleHovered(true)}
          onMouseLeave={() => setIsTitleHovered(false)}
        >
          <h2 className="font-title text-4xl">{taskGroup.title}</h2>

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

        <div className="flex flex-col gap-1.5 p-1">
          {taskGroup.tasks.length === 0 && (
            <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
              <p className="text-slate-500">No task yet</p>

              <Dialog.Trigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    iconName="plusSquare"
                    onClick={() => setShowEditNoteModal(true)}
                  >
                    Create your first task
                  </Button>
                </div>
              </Dialog.Trigger>
            </div>
          )}

          {taskGroup.tasks.map((task) => (
            <TaskItem key={task.id} task={task} colour={colour} />
          ))}
        </div>

        {showEditNoteModal && (
          <EditTaskModal
            task={taskGroup.relevantTaskData}
            onSave={() => {
              setShowEditNoteModal(false);
            }}
          />
        )}
      </Dialog.Root>
    </section>
  );
};
