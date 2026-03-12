import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { mapNote } from "src/notes/utils/mapNote";
import { pb } from "src/pocketbase/utils/connection";
import { useCurrentJournalId } from "../../journals/hooks/useCurrentJournalId";
import type { Note } from "src/notes/Note.type";

type UseGetNotesResponse = {
  notes: Note[];
};

dayjs.extend(utc);

export const useGetNotes = ({
  isBookmarked,
  createdDateString,
}: {
  isBookmarked?: boolean;
  createdDateString?: string;
}): UseGetNotesResponse => {
  const { journalId } = useCurrentJournalId();

  const queryFn = async (): Promise<{
    notes: Note[];
  }> => {
    const filters = [`journal = '${journalId}'`, "deleted = null"];

    if (isBookmarked !== undefined) {
      filters.push(
        isBookmarked ? "isBookmarked = true" : "isBookmarked = false",
      );
    }

    if (createdDateString) {
      const localCreatedDateMidday = dayjs(createdDateString)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

      const utcStartOfDate = localCreatedDateMidday
        .utc()
        .subtract(12, "hour")
        .format("YYYY-MM-DD HH:mm:ss.SSS[Z]");

      const utcEndOfDate = localCreatedDateMidday
        .utc()
        .add(12, "hour")
        .format("YYYY-MM-DD HH:mm:ss.SSS[Z]");

      filters.push(
        `created >= "${utcStartOfDate}" && created <= "${utcEndOfDate}"`,
      );
    }

    const rawNotes = await pb
      .collection("notes")
      .getList(undefined, undefined, {
        filter: filters.join(" && "),
        expand: "tags",
      });

    const notes = rawNotes.items.map(mapNote);

    return { notes };
  };

  // TODO: consider time caching for better performance
  const { data } = useQuery({
    queryKey: ["notes.list", journalId, isBookmarked, createdDateString],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    notes: data?.notes ?? [],
  };
};
