import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  ),
  notFoundComponent: () => {
    const today = new Date().toISOString().split("T")[0];

    return <Navigate to={`/day/${today}`} replace={true} />;
  },
});
