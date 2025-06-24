import { createFileRoute, redirect } from "@tanstack/react-router";
import { TaskItem } from "src/components/dataDisplay/TaskItem/TaskItem";
import { Icon } from "src/components/general/Icon/Icon";
import { SectionalLayout } from "src/components/layout/SectionalLayout/SectionalLayout";
import { Toolbar } from "src/components/layout/Toolbar/Toolbar";
import { colours } from "src/constants/colours.constant";
import { useGetTasks } from "src/hooks/tasks/useGetTasks";
import { cn } from "src/utils/cn";
import { groupTasks } from "src/utils/tasks/groupTasks";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/tasks")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  const { tasks } = useGetTasks({});

  const groupedTasks = groupTasks(tasks, "tag", {});

  const taskSections = groupedTasks.map((group) => ({
    title: group.title,
    prefillNewData: group.relevantTaskData,
    children: (
      <div className="flex flex-col gap-2">
        {group.tasks.map((task) => (
          <TaskItem task={task} />
        ))}
      </div>
    ),
  }));

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="listChecks"
        title="Tasks"
        colour={colours.grey}
        titleItems={[]}
      />

      <SectionalLayout
        header={
          <div className="flex gap-3">
            <Icon
              className={cn("pb-1", colours.grey.text)}
              iconName="listChecks"
              size="xl"
            />

            <h1 className="font-title text-5xl">Tasks</h1>
          </div>
        }
        title="Tasks"
        sections={taskSections}
      />
    </div>
  );
}
