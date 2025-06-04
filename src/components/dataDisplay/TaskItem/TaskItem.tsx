import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Icon } from "src/components/Icon/Icon";
import { TagPill } from "src/components/TagPill/TagPill";
import { Button } from "src/components/controls/Button/Button";
import { colours } from "src/constants/colours.constant";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";
import type { Task } from "src/types/Task.type";

type TaskProps = {
  task: Task;
  colour?: Colour;
};

export const TaskItem = ({ task, colour = colours.orange }: TaskProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "w-full p-1 flex gap-2 items-start rounded-2xl",
        colour.backgroundGlow
      )}
    >
      <button className="pt-px pl-px">
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
                task.cancelledDate ? "line-through" : "font-medium"
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

          <div className="flex gap-1 items-center ">
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

            {task.isFlagged && (
              <Icon iconName="flag" size="sm" className="fill-orange-400" />
            )}

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

        <p className="text-sm italic text-slate-400">{task.description}</p>
      </div>
    </div>
  );
};
