import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "../components/Sidebar/Sidebar.tsx";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="fixed flex h-screen w-screen">
      <Sidebar />
      {/* all the other elements */}
      <div id="detail" className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
