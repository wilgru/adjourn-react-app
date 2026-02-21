import { useQuery } from "@tanstack/react-query";
import { mapNote } from "src/notes/utils/mapNote";
import { pb } from "src/pocketbase/utils/connection";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";

type UseGetNoteResponse = {
  note: Note | undefined;
  refetchNote: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<Note, Error>>;
};

export const useGetNote = ({
  noteId,
}: {
  noteId: string | null;
}): UseGetNoteResponse => {
  const queryFn = async (): Promise<Note> => {
    const rawNote = await pb.collection("notes").getOne(noteId ?? "", {
      expand: "tags, tasks_via_note",
    });
    const note: Note = mapNote(rawNote);
    return note;
  };

  const { data, refetch } = useQuery({
    queryKey: ["notes.get", noteId],
    queryFn,
    enabled: !!noteId,
  });

  return {
    note: data,
    refetchNote: refetch,
  };
};
