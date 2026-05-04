import { useQuery } from "@tanstack/react-query";
import { mapNote } from "src/notes/utils/mapNote";
import { mapTag } from "src/tags/utils/mapTag";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";
import type { Tag } from "src/tags/Tag.type";

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
    const tagResponse = await window.api.getTag({ tagId });
    if (!tagResponse.success) throw new Error(tagResponse.error);

    const pocketbookId = tagResponse.data.pocketbook;
    const [notesResponse, tagsResponse] = pocketbookId
      ? await Promise.all([
          window.api.getNotes({ pocketbookId }),
          window.api.getTags({ pocketbookId }),
        ])
      : [
          { success: true, data: { notes: [] } },
          { success: true, data: { tags: [], tagGroups: [] } },
        ];

    if (!notesResponse.success) throw new Error(notesResponse.error);
    if (!tagsResponse.success) throw new Error(tagsResponse.error);

    const allTags = tagsResponse.data.tags.map((t) => mapTag(t));
    const tagById = new Map<string, Tag>(allTags.map((t) => [t.id, t]));

    const notes = notesResponse.data.notes
      .filter((note) => note.tagIds.includes(tagId))
      .map((note) => {
        const noteTags = note.tagIds
          .map((id) => tagById.get(id))
          .filter((t): t is Tag => t !== undefined);
        return mapNote(note, { tags: noteTags });
      });

    const tag = mapTag(tagResponse.data, { noteCount: notes.length });

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
