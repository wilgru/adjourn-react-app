import type { QueryClient } from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";
import type { Update } from "src/updates/Update.type";

type SyncUpdateListsOptions = {
  notes: Note[];
};

// TODO: could make this generic somehow?
export const syncUpdateLists = (
  queryClient: QueryClient,
  update: Update,
  { notes }: SyncUpdateListsOptions,
) => {
  const noteIds = new Set(notes.map((note) => note.id));

  queryClient
    .getQueryCache()
    .findAll({ queryKey: ["updates.list"] })
    .forEach((query) => {
      const noteId = (query.queryKey as Array<string | undefined>)[2];
      const shouldInclude = !noteId || noteIds.has(noteId);

      queryClient.setQueryData<Update[]>(query.queryKey, (current) => {
        if (!current) return current;

        const index = current.findIndex((item) => item.id === update.id);

        if (!shouldInclude) {
          return index === -1
            ? current
            : current.filter((item) => item.id !== update.id);
        }

        if (index === -1) {
          return [...current, update];
        }

        return current.map((item) => (item.id === update.id ? update : item));
      });
    });
};
