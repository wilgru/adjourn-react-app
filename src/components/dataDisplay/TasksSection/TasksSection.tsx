import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { TaskEditor } from "src/components/dataEntry/TaskEditor/TaskEditor";
import type { Colour } from "src/types/Colour.type";
import type { TasksGroup } from "src/types/Task.type";

type TasksSectionProps = {
  taskGroup: TasksGroup;
  colour: Colour;
};

export const TasksSection = ({ taskGroup, colour }: TasksSectionProps) => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  return (
    <section id="Tasks">
      <div
        className="flex p-2 gap-2 items-center"
        onMouseOver={() => setIsTitleHovered(true)}
        onMouseLeave={() => setIsTitleHovered(false)}
      >
        <h2 className="font-title text-4xl">{taskGroup.title}</h2>

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
        {taskGroup.tasks.length === 0 && (
          <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
            <p className="text-slate-500">No task yet</p>

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

        {taskGroup.tasks.map((task) => (
          <TaskEditor task={task} onSave={() => {}} />
        ))}
      </div>
    </section>
  );
};
