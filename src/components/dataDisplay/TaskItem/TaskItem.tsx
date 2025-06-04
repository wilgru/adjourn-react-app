import dayjs from "dayjs";
import { Icon } from "src/components/Icon/Icon";
import { TagPill } from "src/components/TagPill/TagPill";
import type { Task } from "src/types/Task.type";

type TaskProps = {
  task: Task;
};

export const TaskItem = ({ task }: TaskProps) => {
  return (
    <div className="w-full p-1 flex items-center justify-between">
      <div className="flex flex-col">
        <h3 className="text-md text-slate-700 font-medium">{task.title}</h3>
        <p className="text-sm text-slate-500">{task.description}</p>

        {task.link && (
          <a
            href={task.link}
            className="text-sm py-0.5 px-2 bg-blue-100 text-blue-500 rounded-full hover:underline"
          >
            {task.link}
          </a>
        )}
      </div>

      <div className="flex gap-2">
        {task.isFlagged && (
          <Icon iconName="flag" size="sm" className="fill-orange-400" />
        )}

        {task.tags.map((tag) => (
          <TagPill variant="ghost" key={tag.id} tag={tag} />
        ))}

        {task.dueDate && task.dueDate.isAfter(dayjs(), "day") && (
          <p className="text-sm bg-red-300 text-red-500">
            {task.dueDate.format("MMM D, YYYY")}
          </p>
        )}
      </div>
    </div>
  );
};
