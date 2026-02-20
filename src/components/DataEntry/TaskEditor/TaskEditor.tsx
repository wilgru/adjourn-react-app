import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { Icon } from "src/components/general/Icon/Icon";
import { colours } from "src/constants/colours.constant";
import { useCreateTask } from "src/hooks/tasks/useCreateTask";
import { useDeleteTask } from "src/hooks/tasks/useDeleteTask";
import { useUpdateTask } from "src/hooks/tasks/useUpdateTask";
import { cn } from "src/utils/cn";
import type { Task } from "src/types/Task.type";

type TaskEditorProps = {
  task?: Partial<Task>;
  onSave?: () => void;
};

const getInitialTask = (task: Partial<Task> | undefined): Task => {
  return {
    id: task?.id || "",
    title: task?.title || "",
    description: task?.description || "",
    note: task?.note || null,
    link: task?.link || null,
    dueDate: task?.dueDate || null,
    completedDate: task?.completedDate || null,
    cancelledDate: task?.cancelledDate || null,
    isFlagged: task?.isFlagged || false,
    created: task?.created || dayjs(),
    updated: task?.updated || dayjs(),
  };
};

export const TaskEditor = ({ task, onSave }: TaskEditorProps) => {
  const { createTask } = useCreateTask();
  const { updateTask } = useUpdateTask();
  const { deleteTask } = useDeleteTask();

  const [editedTask, setEditedTask] = useState<Task>(getInitialTask(task));

  // const initialTask = useMemo(() => getInitialTask(task), [task]);

  const onUpdateTask = async (updateTaskData?: Partial<Task>) => {
    if (!editedTask.title && !editedTask.description && !editedTask.link) {
      deleteTask({ taskId: editedTask.id });
    }

    setEditedTask((currentEditedTask) => {
      const newTaskData = {
        ...currentEditedTask,
        ...updateTaskData,
        updated: dayjs(),
      };

      return newTaskData;
    });

    if (editedTask.id) {
      await updateTask({
        taskId: editedTask.id,
        updateTaskData: editedTask,
      });
    } else {
      await createTask({ createTaskData: editedTask });
    }

    onSave?.();
  };

  return (
    <div className="w-full flex gap-2 items-start">
      <button
        className="pt-px pl-px"
        onClick={() => {
          const isCompleted = !!editedTask.completedDate;
          const isCancelled = !!editedTask.cancelledDate;

          if (isCompleted || isCancelled) {
            onUpdateTask({
              completedDate: null,
              cancelledDate: null,
            });
          } else {
            onUpdateTask({
              completedDate: dayjs(),
            });
          }
        }}
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

      <div className="w-full flex items-start justify-between">
        <div className="flex flex-col grow">
          <textarea
            name="title"
            value={editedTask.title ?? ""}
            placeholder="No Title"
            onChange={(e) =>
              onUpdateTask({
                title: e.target.value,
              })
            }
            className={cn(
              "h-6 w-full tracking-tight text-md placeholder-slate-400 select-none resize-none outline-none",
              (editedTask.completedDate ?? editedTask.cancelledDate)
                ? "text-slate-500"
                : "text-slate-700",
              editedTask.cancelledDate && "line-through",
            )}
          />

          <textarea
            name="description"
            value={editedTask.description ?? ""}
            placeholder="No description"
            onChange={(e) =>
              onUpdateTask({
                description: e.target.value,
              })
            }
            className="h-6 w-full text-sm font-normal bg-white placeholder-slate-400 text-slate-500 select-none resize-none outline-none"
          />
        </div>

        <div className="flex flex-row flex-wrap items-center gap-2">
          {editedTask.dueDate ? (
            <Button
              size="sm"
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                editedTask.dueDate.isBefore(dayjs(), "day") &&
                  !editedTask.completedDate
                  ? "bg-red-100 text-red-500"
                  : "bg-gray-100 text-gray-500",
              )}
            >
              {editedTask.dueDate.format("MMM D, YYYY")}
            </Button>
          ) : (
            <Button iconName="calendarDots" variant="ghost" size="sm" />
          )}

          <Button
            colour={colours.blue}
            variant="ghost"
            size="sm"
            iconName="link"
          />
        </div>
      </div>
    </div>
  );
};
