import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapNote } from "src/utils/notes/mapNote";
import type { Note } from "src/types/Note.type";

type UseGetNotesResponse = {
  notes: Note[];
};

export const useGetNotes = ({
  isFlagged,
  createdDateString,
}: {
  isFlagged: boolean;
  createdDateString?: string;
}): UseGetNotesResponse => {
  const queryFn = async (): Promise<{
    notes: Note[];
  }> => {
    let filter = `deleted = null${isFlagged ? " && isFlagged = true" : ""}`;
    if (createdDateString) {
      const startOfDay = `${createdDateString} 00:00:00.000Z`;
      const endOfDay = `${createdDateString} 23:59:59.999Z`;
      filter += ` && created >= "${startOfDay}" && created <= "${endOfDay}"`;
    }

    const rawNotes = await pb
      .collection("notes")
      .getList(undefined, undefined, {
        filter,
        expand: "tags",
        sort: "-isPinned",
      });

    const notes = rawNotes.items.map(mapNote);

    return { notes };
  };

  // TODO: consider time caching for better performance
  const { data } = useQuery({
    queryKey: ["notes.list", isFlagged, createdDateString],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    notes: data?.notes ?? [],
  };
};
