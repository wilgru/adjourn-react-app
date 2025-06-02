import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { TaskAndNotesLayout } from "src/components/TaskAndNotesLayout/TaskAndNotesLayout";
import { Toolbar } from "src/components/Toolbar/Toolbar";
import { Button } from "src/components/controls/Button/Button";
import { useGetSlips } from "src/hooks/slips/useGetSlips";
import { useTaskAndNotesTOCItems } from "src/hooks/useTaskAndNotesTOCItems";
import { getNavigationDay } from "src/utils/getNavigationDay";
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
  const { dateString } = Route.useParams();
  const navigate = useNavigate();
  const { slips } = useGetSlips({
    isFlagged: false,
    createdDateString: dateString,
  });
  const tableOfContentItems = useTaskAndNotesTOCItems(slips);

  const date = dayjs(dateString, "YYYY-MM-DD");
  const today = dayjs();
  const yesterday = date.subtract(1, "day");
  const tomorrow = date.add(1, "day");

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="calendarDot"
        title={"today"}
        titleItems={[
          <Button
            variant="ghost"
            size="sm"
            iconName="caretLeft"
            onClick={() =>
              navigate({ to: `/day/${getNavigationDay(yesterday)}` })
            }
          />,
          <Button
            variant="ghost"
            size="sm"
            iconName="circle"
            onClick={() => navigate({ to: `/day/${getNavigationDay(today)}` })}
          />,
          <Button
            variant="ghost"
            size="sm"
            iconName="caretRight"
            onClick={() =>
              navigate({ to: `/day/${getNavigationDay(tomorrow)}` })
            }
          />,
        ]}
      />

      <TaskAndNotesLayout
        header={
          <div className="flex items-baseline gap-3">
            <h1 className="text-5xl font-title text-slate-800">
              {date.format("dddd")}
            </h1>

            <h3 className="text-2xl text-slate-400">
              {date.format("MMMM D, YYYY")}
            </h3>
          </div>
        }
        slips={slips}
        tableOfContentItems={tableOfContentItems}
      />
    </div>
  );
}
