import { createFileRoute, redirect } from "@tanstack/react-router";
import { Icon } from "src/components/general/Icon/Icon";
import { SectionalLayout } from "src/components/layout/SectionalLayout/SectionalLayout";
import { Toolbar } from "src/components/layout/Toolbar/Toolbar";
import { colours } from "src/constants/colours.constant";
import { useGetNotes } from "src/hooks/notes/useGetNotes";
import { useGetTasks } from "src/hooks/tasks/useGetTasks";
import { useGetSectionData } from "src/hooks/useGetSectionData";
import { cn } from "src/utils/cn";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/flagged")({
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
  const { tasks } = useGetTasks({ isFlagged: true });
  const { notes } = useGetNotes({
    isFlagged: true,
  });

  const sections = useGetSectionData({
    tasks,
    notes,
    relevantData: {
      isFlagged: true,
    },
  });

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="flag" title={"Flagged"} titleItems={[]} />

      <SectionalLayout
        header={
          <div className="flex gap-3">
            <Icon
              className={cn("pb-1", colours.orange.text)}
              iconName="flag"
              size="xl"
            />

            <h1 className="font-title text-5xl">Flagged</h1>
          </div>
        }
        title="Flagged"
        sections={sections}
      />
    </div>
  );
}
