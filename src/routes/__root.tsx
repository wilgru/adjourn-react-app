import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useNavigateToLastUsedJournal } from "src/hooks/journals/useGetLastUsedJournal";
import { getNavigationDay } from "src/utils/getNavigationDay";
import isAuthenticated from "src/utils/users/isAuthenticated";

const NotFoundComponent = () => {
  const { lastUsedJournal, isFetching } = useNavigateToLastUsedJournal();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace={true} />;
  }

  if (isFetching) {
    return <div>Loading journals...</div>; // TODO: handle this better, use a spinner/loading component?
  }

  if (!lastUsedJournal) {
    return <Navigate to="/create-journal" replace={true} />;
  }

  return (
    <Navigate
      to="/$journalId/planner/$dateString"
      params={{ journalId: lastUsedJournal.id, dateString: getNavigationDay() }}
      replace={true}
    />
  );
};

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  notFoundComponent: NotFoundComponent,
});
