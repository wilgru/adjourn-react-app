import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapNote } from "src/utils/notes/mapNote";
import { mapTag } from "src/utils/tags/mapTag";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Note } from "src/types/Note.type";
import type { Tag } from "src/types/Tag.type";

type UseTagResponse = {
  tag: Tag | undefined;
  notes: Note[];
  refetchTag: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        tag: Tag;
        notes: Note[];
      },
      Error
    >
  >;
};

export const useGetTag = (tagId: string): UseTagResponse => {
  const queryFn = async (): Promise<{
    tag: Tag;
    notes: Note[];
  }> => {
    const rawTag = await pb.collection("tags").getOne(tagId, {
      expand:
        "notes_via_tags, notes_via_tags.tags, tasks_via_tags, tasks_via_tags.tags",
    });
    const tag: Tag = mapTag({
      ...rawTag,
      totalNotes: rawTag.expand?.notes_via_tags?.length ?? 0,
    });

    const rawNotes = rawTag.expand?.notes_via_tags ?? [];
    const notes: Note[] = rawNotes.map(mapNote);

    return {
      tag,
      notes,
    };
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tags.get", tagId],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    tag: data?.tag,
    notes: data?.notes ?? [],
    refetchTag: refetch,
  };
};
