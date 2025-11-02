import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useGetJournals } from "src/hooks/journals/useGetJournals";
import { getNavigationDay } from "src/utils/getNavigationDay";
import isAuthenticated from "src/utils/users/isAuthenticated";

const NotFoundComponent = () => {
  const today = getNavigationDay();
  const { journals, isFetching } = useGetJournals();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace={true} />;
  }

  if (isFetching) {
    return <div>Loading journals...</div>; // TODO: handle this better, use a spinner/loading component?
  }

  const firstJournalId = journals.at(0)?.id;

  if (!firstJournalId) {
    return <Navigate to="/create-journal" replace={true} />;
  }

  return <Navigate to={`/${firstJournalId}/planner/${today}`} replace={true} />;
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
