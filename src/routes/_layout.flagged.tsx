import { createFileRoute, redirect } from "@tanstack/react-router";
import { Icon } from "src/components/Icon/Icon";
import { TaskAndNotesLayout } from "src/components/TaskAndNotesLayout/TaskAndNotesLayout";
import { Toolbar } from "src/components/Toolbar/Toolbar";
import { colours } from "src/constants/colours.constant";
import { useGetSlips } from "src/hooks/slips/useGetSlips";
import { useTaskAndNotesTOCItems } from "src/hooks/useTaskAndNotesTOCItems";
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
  const { slips } = useGetSlips({
    isFlagged: true,
  });
  const tableOfContentItems = useTaskAndNotesTOCItems(slips);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="flag" title={"Flagged"} titleItems={[]} />

      <TaskAndNotesLayout
        header={
          <div className="flex gap-3">
            <Icon
              className={cn(colours.orange.text)}
              iconName="flag"
              size="xl"
            />

            <h1 className="font-title text-5xl">Flagged</h1>
          </div>
        }
        slips={slips}
        tableOfContentItems={tableOfContentItems}
      />
    </div>
  );
}
