import { createFileRoute, redirect } from "@tanstack/react-router";
import { Toolbar } from "src/components/controls/Toolbar/Toolbar";
import { NotesLayout } from "src/components/layout/NotesLayout/NotesLayout";
import { colours } from "src/constants/colours.constant";
import { useGetNote } from "src/hooks/notes/useGetNote";
import { useGetNotes } from "src/hooks/notes/useGetNotes";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/$journalId/notes")({
  component: NotesComponent,
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
  validateSearch: (
    search: Record<string, unknown>,
  ): { noteId: string | null } => {
    return {
      noteId: typeof search.noteId === "string" ? search.noteId : null,
    };
  },
});

function NotesComponent() {
  const { notes } = useGetNotes({
    createdDateString: undefined,
    isFlagged: undefined,
  });
  const { noteId } = Route.useSearch(); // TODO: use in loaders?
  const { note } = useGetNote({ noteId });

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName="pencil"
        title={"Notes"}
        colour={colours.grey}
        titleItems={[]}
      />

      <NotesLayout
        title={"Notes"}
        notes={notes}
        colour={colours.grey}
        selectedNote={note || null}
        description={null}
      />
    </div>
  );
}
