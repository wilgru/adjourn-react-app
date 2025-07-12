import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-journal")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/create-journal"!</div>;
}
