import { Flag } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { TagPill } from "src/components/dataDisplay/TagPill/TagPill";
import { Icon } from "src/components/general/Icon/Icon";
import { EditTaskModal } from "src/components/modals/EditTaskModal/EditTaskModal";
import { colours } from "src/constants/colours.constant";
import { useUpdateTask } from "src/hooks/tasks/useUpdateTask";
import { useCurrentJournalId } from "src/hooks/useCurrentJournalId";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";
import type { Task } from "src/types/Task.type";

type TaskProps = {
  task: Task;
  colour?: Colour;
};

export const TaskItem = ({ task, colour = colours.orange }: TaskProps) => {
  const { journalId } = useCurrentJournalId();
  const navigate = useNavigate();
  const { updateTask } = useUpdateTask();

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full p-1 flex gap-2 items-start rounded-2xl"
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
        <Dialog.Root>
          <div className="flex justify-between items-center gap-2">
            <Dialog.Trigger asChild>
              <div className="flex flex-shrink gap-2 items-center cursor-pointer">
                <h3
                  className={cn(
                    "text-md",
                    (task.completedDate ?? task.cancelledDate)
                      ? "text-slate-500"
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
            </Dialog.Trigger>

            <div className="shrink-0 flex gap-1 items-center">
              {task.tags.map((tag) => (
                <TagPill
                  variant="ghost"
                  key={tag.id}
                  tag={tag}
                  collapsed={!isHovered}
                  onClick={(tagId) => {
                    navigate({ to: `/${journalId}/tags/${tagId}` });
                  }}
                />
              ))}

              {task.isFlagged && (
                <Flag className="fill-orange-400 m-1" weight="fill" size={18} />
              )}

              {task.dueDate && (
                <p
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
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

          <Dialog.Trigger asChild>
            <p
              className={cn(
                "text-sm cursor-pointer",
                task.completedDate || task.cancelledDate
                  ? "text-slate-400"
                  : "text-slate-600"
              )}
            >
              {task.description}
            </p>
          </Dialog.Trigger>

          <EditTaskModal task={task} />
        </Dialog.Root>
      </div>
    </div>
  );
};
