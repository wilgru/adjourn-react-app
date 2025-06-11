import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { TaskItem } from "src/components/dataDisplay/TaskItem/TaskItem";
import type { Colour } from "src/types/Colour.type";
import type { Task } from "src/types/Task.type";

type TasksSectionProps = {
  tasks: Task[];
  colour: Colour;
};

export const TasksSection = ({ tasks, colour }: TasksSectionProps) => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  return (
    <section id="Tasks">
      <div
        className="flex gap-2 p-2"
        onMouseOver={() => setIsTitleHovered(true)}
        onMouseLeave={() => setIsTitleHovered(false)}
      >
        <h2 className="text-slate-400 font-title text-3xl">Tasks</h2>

        {isTitleHovered && (
          <div className="mb-2">
            <Button
              variant="ghost-strong"
              className="w-full"
              iconName="plus"
              size="sm"
              onClick={() => {}}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-1">
        {tasks.length === 0 && (
          <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
            <p className="text-slate-500">No tasks yet</p>

            <div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                iconName="plusSquare"
                onClick={() => {}}
              >
                Create your first task
              </Button>
            </div>
          </div>
        )}

        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} colour={colour} />
        ))}
      </div>
    </section>
  );
};
