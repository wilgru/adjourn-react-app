import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { isSideBarVisibleAtom } from "src/atoms/isSidebarVisibleAtom.ts";
import { Sidebar } from "../components/Sidebar/Sidebar.tsx";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const isSideBarVisible = useAtomValue(isSideBarVisibleAtom);

  return (
    <div className="fixed flex h-screen w-screen">
      {isSideBarVisible && <Sidebar />}
      {/* all the other elements */}
      <div id="detail" className="w-full">
        <Outlet />
      </div>
    </div>
  );
}
