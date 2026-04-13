import * as Dialog from "@radix-ui/react-dialog";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import requireClientAuth from "src/Users/utils/requireClientAuth";
import { Button } from "src/common/components/Button/Button";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { useCurrentJournal } from "src/journals/hooks/useCurrentJournal";
import { CompletedTasksModal } from "src/tasks/components/CompletedTasksModal/CompletedTasksModal";
import { TasksLayout } from "src/tasks/components/TasksLayout/TasksLayout";
import { useGetTasks } from "src/tasks/hooks/useGetTasks";

export const Route = createFileRoute("/_layout/$journalId/tasks")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    requireClientAuth(location);
  },
});

function RouteComponent() {
  const { currentJournal } = useCurrentJournal();

  const { tasks } = useGetTasks({});
  const [noNoteEditorTrigger, setNoNoteEditorTrigger] = useState(0);
  const [completedModalOpen, setCompletedModalOpen] = useState(false);

  const today = dayjs();
  const incompleteTasks = tasks.filter((t) => !t.completedDate && !t.cancelledDate);
  const completedTodayTasks = tasks.filter(
    (t) =>
      (t.completedDate && t.completedDate.isSame(today, "day")) ||
      (t.cancelledDate && t.cancelledDate.isSame(today, "day")),
  );
  const visibleTasks = [...incompleteTasks, ...completedTodayTasks];

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="checkCircle"
        title="Tasks"
        colour={currentJournal?.colour}
        journalColour={currentJournal?.colour}
      >
        <Button
          variant="ghost"
          size="sm"
          colour={currentJournal?.colour}
          iconName="plus"
          onClick={() => setNoNoteEditorTrigger((c) => c + 1)}
        />
      </Toolbar>

      <TasksLayout
        header={
          <div className="flex gap-3 items-end">
            <Icon
              className={cn("pb-1", currentJournal?.colour?.text)}
              iconName="checkCircle"
              size="xl"
            />

            <h1 className="font-title text-5xl">Tasks</h1>

            <div className="flex items-center gap-2 pb-1.5">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-500",
                )}
              >
                {incompleteTasks.length}
              </span>

              {completedTodayTasks.length > 0 && (
                <Dialog.Root
                  open={completedModalOpen}
                  onOpenChange={setCompletedModalOpen}
                >
                  <Dialog.Trigger asChild>
                    <button
                      className={cn(
                        "px-2 py-0.5 rounded-full text-sm font-medium transition-colors",
                        currentJournal?.colour?.backgroundPill,
                        currentJournal?.colour?.textPill,
                        "hover:opacity-80",
                      )}
                    >
                      {completedTodayTasks.length} done
                    </button>
                  </Dialog.Trigger>
                  <CompletedTasksModal
                    tasks={completedTodayTasks}
                    colour={currentJournal?.colour}
                  />
                </Dialog.Root>
              )}
            </div>
          </div>
        }
        title="Tasks"
        tasks={visibleTasks}
        colour={currentJournal?.colour}
        noNoteEditorTrigger={noNoteEditorTrigger}
      />
    </div>
  );
}
