import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
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

    return <Navigate to={`/day/${today}`} replace={true} />;
  },
});
