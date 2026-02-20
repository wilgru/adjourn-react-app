import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useSetAtom } from "jotai";
import { jumpToDateAtom } from "src/atoms/jumpToDateAtom";
import { Button } from "src/components/controls/Button/Button";
import { Toolbar } from "src/components/controls/Toolbar/Toolbar";
import { Calendar } from "src/components/navigation/Calendar/Calendar";
import { getNavigationDay } from "src/utils/getNavigationDay";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/$journalId/logbook/$dateString")(
  {
    component: LogbookComponent,
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
  },
);

function LogbookComponent() {
  const { journalId } = Route.useParams();
  const { dateString } = Route.useParams();

  const navigate = useNavigate();
  const setJumpToAtom = useSetAtom(jumpToDateAtom);

  const date = dayjs(dateString, "YYYY-MM-DD");
  const today = dayjs();
  const yesterday = date.subtract(1, "day");
  const tomorrow = date.add(1, "day");

  const title = date.format("ddd MMM D, YYYY");

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="notebook"
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
                  to: `/${journalId}/logbook/${getNavigationDay(yesterday)}`,
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
                  to: `/${journalId}/logbook/${getNavigationDay(today)}`,
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
                  to: `/${journalId}/logbook/${getNavigationDay(tomorrow)}`,
                });
              }}
            />
          </div>,
        ]}
      />

      <Calendar journalId={journalId} />
    </div>
  );
}
