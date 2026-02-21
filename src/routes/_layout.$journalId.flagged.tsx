import { createFileRoute, redirect } from "@tanstack/react-router";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { NotesLayout } from "src/notes/components/NotesLayout/NotesLayout";
import { useGetNote } from "src/notes/hooks/useGetNote";
import { useGetNotes } from "src/notes/hooks/useGetNotes";

export const Route = createFileRoute("/_layout/$journalId/flagged")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  validateSearch: (
    search: Record<string, unknown>,
  ): { noteId: string | null } => {
    return {
      noteId: typeof search.noteId === "string" ? search.noteId : null,
    };
  },
});

function RouteComponent() {
  const { notes } = useGetNotes({
    isFlagged: true,
  });
  const { noteId } = Route.useSearch(); // TODO: use in loaders?
  const { note } = useGetNote({ noteId });

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="flag" title={"Flagged"} titleItems={[]} />

      <NotesLayout
        title="Flagged"
        notes={notes}
        prefillNewNoteData={{ isFlagged: true }}
        selectedNote={note || null}
        description={null}
      />
    </div>
  );
}
