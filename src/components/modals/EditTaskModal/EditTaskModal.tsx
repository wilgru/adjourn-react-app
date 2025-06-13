import * as Dialog from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { Toggle } from "src/components/controls/Toggle/Toggle";
import { TagMultiSelect } from "src/components/dataEntry/TagMultiSelect/TagMultiSelect";
import { Icon } from "src/components/general/Icon/Icon";
import { colours } from "src/constants/colours.constant";
import { useCreateTask } from "src/hooks/tasks/useCreateTask";
import { useDeleteTask } from "src/hooks/tasks/useDeleteTask";
import { useUpdateTask } from "src/hooks/tasks/useUpdateTask";
import type { Task } from "src/types/Task.type";

type EditTaskModalProps = {
  task?: Partial<Task>;
  onSave?: () => void;
};

const getInitialTask = (task: Partial<Task> | undefined): Task => {
  return {
    id: task?.id || "",
    title: task?.title || "",
    description: task?.description || "",
    link: task?.link || null,
    dueDate: task?.dueDate || null,
    completedDate: task?.completedDate || null,
    cancelledDate: task?.cancelledDate || null,
    tags: task?.tags || [],
    isFlagged: task?.isFlagged || false,
    created: task?.created || dayjs(),
    updated: task?.updated || dayjs(),
  };
};

export const EditTaskModal = ({ task, onSave }: EditTaskModalProps) => {
  const { createTask } = useCreateTask();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();

  const [editedTask, setEditedTask] = useState<Task>(getInitialTask(task));

  const initialTask = useMemo(() => getInitialTask(task), [task]);

  const onSaveNote = async () => {
    if (!editedTask.title && !editedTask.description && !editedTask.link) {
      return;
    }
    if (editedTask.id) {
      await updateTask({
        taskId: initialTask.id,
        updateTaskData: editedTask,
      });
    } else {
      createTask({ createTaskData: editedTask });
    }
    onSave?.();
  };

  const onDeleteTask = async () => {
    deleteTask({ taskId: initialTask.id });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-25" />
      <Dialog.Content
        onInteractOutside={onSaveNote}
        onEscapeKeyDown={onSaveNote}
        onFocusOutside={onSaveNote}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] w-3/4 max-w-[500px] bg-white flex flex-col gap-4 p-3 border border-slate-300 rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <button
              className="pt-px pl-px"
              onClick={() =>
                setEditedTask((currentEditedNote) => {
                  const newNoteData = {
                    ...currentEditedNote,
                    completedDate: currentEditedNote.completedDate
                      ? null
                      : dayjs(),
                  };

                  return newNoteData;
                })
              }
            >
              <Icon
                iconName={
                  editedTask.completedDate
                    ? "checkCircle"
                    : editedTask.cancelledDate
                      ? "minusCircle"
                      : "circle"
                }
                size="md"
                weight={
                  (editedTask.completedDate ?? editedTask.cancelledDate)
                    ? "fill"
                    : "regular"
                }
                className="fill-slate-400 hover:fill-slate-600 transition-colors"
              />
            </button>

            <textarea
              name="title"
              value={editedTask.title ?? ""}
              placeholder="No Title"
              onChange={(e) =>
                setEditedTask((currentEditedNote) => {
                  const newNoteData = {
                    ...currentEditedNote,
                    title: e.target.value,
                  };

                  return newNoteData;
                })
              }
              className="h-10 w-full pt-1 text-2xl font-normal tracking-tight overflow-y-hidden bg-white placeholder-slate-400 select-none resize-none outline-none"
            />
          </div>

          <textarea
            name="description"
            value={editedTask.description ?? ""}
            placeholder="No description"
            onChange={(e) =>
              setEditedTask((currentEditedNote) => {
                const newNoteData = {
                  ...currentEditedNote,
                  description: e.target.value,
                };

                return newNoteData;
              })
            }
            className="w-full text-sm font-normal bg-white placeholder-slate-400 text-slate-500 select-none resize-none outline-none"
          />

          <div className="flex justify-between border-t border-slate-200 pt-3">
            <div className="flex flex-row items-center gap-2">
              <Button variant="ghost" size="sm">
                Due date
              </Button>

              <TagMultiSelect
                initialTags={initialTask.tags}
                onChange={(tags) =>
                  setEditedTask((currentEditedNote) => {
                    const newNoteData = {
                      ...currentEditedNote,
                      tags,
                    };

                    return newNoteData;
                  })
                }
              />

              <Button
                colour={colours.red}
                variant="ghost"
                size="sm"
                iconName="link"
                onClick={onDeleteTask}
              />

              <Toggle
                isToggled={editedTask.isFlagged}
                size="sm"
                onClick={() =>
                  setEditedTask((currentEditedNote) => {
                    const newNoteData = {
                      ...currentEditedNote,
                      isFlagged: !editedTask.isFlagged,
                    };

                    return newNoteData;
                  })
                }
                iconName="flag"
              />
            </div>

            <Dialog.Close asChild>
              <Button
                colour={colours.red}
                variant="ghost"
                size="sm"
                iconName="trash"
                onClick={onDeleteTask}
              />
            </Dialog.Close>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
