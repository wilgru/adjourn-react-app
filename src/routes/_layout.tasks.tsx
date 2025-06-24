import { createFileRoute, redirect } from "@tanstack/react-router";
import { Toolbar } from "src/components/controls/Toolbar/Toolbar";
import { Icon } from "src/components/general/Icon/Icon";
import { TasksLayout } from "src/components/layout/TasksLayout/TasksLayout";
import { colours } from "src/constants/colours.constant";
import { useGetTasks } from "src/hooks/tasks/useGetTasks";
import { cn } from "src/utils/cn";
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

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="listChecks"
        title="Tasks"
        colour={colours.grey}
        titleItems={[]}
      />

      <TasksLayout
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
        tasks={tasks}
      />
    </div>
  );
}
