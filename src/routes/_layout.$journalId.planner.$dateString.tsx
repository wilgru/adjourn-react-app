import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { jumpToDateAtom } from "src/atoms/jumpToDateAtom";
import { Button } from "src/components/controls/Button/Button";
import { Toolbar } from "src/components/controls/Toolbar/Toolbar";
import { TaskAndNotesLayout } from "src/components/layout/TaskAndNotesLayout/TaskAndNotesLayout";
import { useGetNotes } from "src/hooks/notes/useGetNotes";
import { useGetTasks } from "src/hooks/tasks/useGetTasks";
import { getNavigationDay } from "src/utils/getNavigationDay";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/$journalId/planner/$dateString")(
  {
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
  }
);

function StreamIndexComponent() {
  const { journalId } = Route.useParams();
  const { dateString } = Route.useParams();
  const navigate = useNavigate();
  const { tasks } = useGetTasks({
    dateString: dateString,
  });
  const { notes } = useGetNotes({
    isFlagged: false,
    createdDateString: dateString,
  });
  const setJumpToAtom = useSetAtom(jumpToDateAtom);

  const date = dayjs(dateString, "YYYY-MM-DD");
  const today = dayjs();
  const yesterday = date.subtract(1, "day");
  const tomorrow = date.add(1, "day");

  const title = date.format("ddd MMM D, YYYY");

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="calendarDots"
        title={title}
        titleItems={[
          <div>
            <Button
              variant="ghost"
              size="sm"
              iconName="arrowArcLeft"
              onClick={() => {
                setJumpToAtom(yesterday);
                navigate({
                  to: `/${journalId}/planner/${getNavigationDay(yesterday)}`,
                });
              }}
            />
          </div>,
          <div>
            <Button
              variant="ghost"
              size="sm"
              iconName="calendarDot"
              onClick={() => {
                setJumpToAtom(today);
                navigate({
                  to: `/${journalId}/planner/${getNavigationDay(today)}`,
                });
              }}
            />
          </div>,
          <div>
            <Button
              variant="ghost"
              size="sm"
              iconName="arrowArcRight"
              onClick={() => {
                setJumpToAtom(tomorrow);
                navigate({
                  to: `/${journalId}/planner/${getNavigationDay(tomorrow)}`,
                });
              }}
            />
          </div>,
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
        title={title}
        tasks={tasks}
        notes={notes}
        prefillNewTaskData={{ dueDate: today }}
        showNoteCreateTimeOnly
      />
    </div>
  );
}
