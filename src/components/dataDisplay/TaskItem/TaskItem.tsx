import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { Toggle } from "src/components/controls/Toggle/Toggle";
import { TagPill } from "src/components/dataDisplay/TagPill/TagPill";
import { Icon } from "src/components/general/Icon/Icon";
import { EditTaskModal } from "src/components/modals/EditTaskModal/EditTaskModal";
import { colours } from "src/constants/colours.constant";
import { useUpdateTask } from "src/hooks/tasks/useUpdateTask";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";
import type { Task } from "src/types/Task.type";

type TaskProps = {
  task: Task;
  colour?: Colour;
};

export const TaskItem = ({ task, colour = colours.orange }: TaskProps) => {
  const navigate = useNavigate();
  const { updateTask } = useUpdateTask();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "w-full p-1 flex gap-2 items-start rounded-2xl",
        colour.backgroundGlow
      )}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className="pt-px pl-px"
        onClick={() =>
          updateTask({
            taskId: task.id,
            updateTaskData: {
              ...task,
              completedDate: task.completedDate ? null : dayjs(),
            },
          })
        }
      >
        <Icon
          iconName={
            task.completedDate
              ? "checkCircle"
              : task.cancelledDate
                ? "minusCircle"
                : "circle"
          }
          size="md"
          weight={
            (task.completedDate ?? task.cancelledDate) ? "fill" : "regular"
          }
          className="fill-slate-400 hover:fill-slate-600 transition-colors"
        />
      </button>

      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 items-center">
            <h3
              className={cn(
                "text-md",
                (task.completedDate ?? task.cancelledDate)
                  ? "text-slate-400"
                  : "text-slate-700",
                task.cancelledDate && "line-through"
              )}
            >
              {task.title}
            </h3>

            {task.link && (
              <Button
                variant="link"
                size="sm"
                colour={colour}
                iconName="link"
              />
            )}
          </div>

          <div className="flex gap-1 items-center">
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

              <EditTaskModal task={task} />
            </Dialog.Root>

            {(task.isFlagged || isHovered) && (
              <Toggle
                isToggled={task.isFlagged}
                size="sm"
                onClick={() =>
                  updateTask({
                    taskId: task.id,
                    updateTaskData: {
                      ...task,
                      isFlagged: !task.isFlagged,
                    },
                  })
                }
                iconName="flag"
              />
            )}

            {task.tags.map((tag) => (
              <TagPill
                variant="ghost"
                key={tag.id}
                tag={tag}
                onClick={(tagId) => {
                  navigate({ to: `/tags/${tagId}` });
                }}
              />
            ))}

            {task.dueDate && (
              <p
                className={cn(
                  "text-xs px-2 py-1 ml-2 rounded-full",
                  task.dueDate.isBefore(dayjs(), "day") && !task.completedDate
                    ? "bg-red-100 text-red-500"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {task.dueDate.format("MMM D, YYYY")}
              </p>
            )}
          </div>
        </div>

        <p
          className={cn(
            "text-sm",
            task.completedDate || task.cancelledDate
              ? "text-slate-400"
              : "text-slate-500"
          )}
        >
          {task.description}
        </p>
      </div>
    </div>
  );
};
