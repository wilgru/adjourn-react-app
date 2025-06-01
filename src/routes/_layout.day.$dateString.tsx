import * as Dialog from "@radix-ui/react-dialog";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { TaskAndNotesLayout } from "src/components/TaskAndNotesLayout/TaskAndNotesLayout";
import { Toolbar } from "src/components/Toolbar/Toolbar";
import { Button } from "src/components/controls/Button/Button";
import { useGetSlips } from "src/hooks/slips/useGetSlips";
import { useTaskAndNotesTOCItems } from "src/hooks/useTaskAndNotesTOCItems";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/day/$dateString")({
  component: StreamIndexComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          // (Do not use `router.state.resolvedLocation` as it can potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
});

function StreamIndexComponent() {
  const { slips } = useGetSlips({ isFlagged: false });
  const tableOfContentItems = useTaskAndNotesTOCItems(slips);

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="calendarDot"
        title={"today"}
        titleItems={[
          <div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="sm" iconName="caretLeft" />
              </Dialog.Trigger>

              {/* <EditJournalModal journal={journal} /> */}
            </Dialog.Root>
          </div>,
          <div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="ghost" size="sm" iconName="caretRight" />
              </Dialog.Trigger>

              {/* <EditJournalModal journal={journal} /> */}
            </Dialog.Root>
          </div>,
        ]}
      />

      <TaskAndNotesLayout
        header={
          <div className="flex items-baseline gap-3">
            <h1 className="text-5xl font-title text-slate-800">Today</h1>

            <h3 className="text-2xl text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
          </div>
        }
        slips={slips}
        tableOfContentItems={tableOfContentItems}
      />
    </div>
  );
}
