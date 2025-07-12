import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useGetJournals } from "src/hooks/journals/useGetJournals";
import { getNavigationDay } from "src/utils/getNavigationDay";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  notFoundComponent: () => {
    const today = getNavigationDay();
    const { journals, isFetching } = useGetJournals();

    if (isFetching) {
      return <div>Loading journals...</div>; // or a spinner/loading component
    }

    console.log("RootRoute journals", journals);
    const firstJournalId = journals[0]?.id;

    if (!firstJournalId) {
      return <Navigate to="/create-journal" replace={true} />;
    }

    return (
      <Navigate to={`/${firstJournalId}/planner/${today}`} replace={true} />
    );
  },
});
