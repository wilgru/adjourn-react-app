import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";
import { mapTag } from "src/tags/utils/mapTag";
import { mapTagGroup } from "src/tags/utils/mapTagGroup";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Tag, TagGroup } from "src/tags/Tag.type";

type UseGetTagGroupsResponse = {
  ungroupedTags: Tag[];
  tagGroups: TagGroup[];
  refetchTagGroups: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        ungroupedTags: Tag[];
        tagGroups: TagGroup[];
      },
      Error
    >
  >;
};

export const useGetTagGroups = (): UseGetTagGroupsResponse => {
  const { journalId } = useCurrentJournalId();

  const queryFn = async (): Promise<{
    ungroupedTags: Tag[];
    tagGroups: TagGroup[];
  }> => {
    const filters = [`journal = '${journalId}'`];

    const rawTagGroups = await pb
      .collection("tagGroups")
      .getList(undefined, undefined, {
        filter: filters.join(" && "),
      });
    const mappedTagGroups = rawTagGroups.items.map(mapTagGroup);

    const rawTags = await pb
      .collection("tagsWithNoteCounts")
      .getList(undefined, undefined, {
        filter: filters.join(" && "),
      });
    const mappedTags = rawTags.items.map(mapTag);

    const ungroupedTags: Tag[] = [];
    mappedTags.forEach((tag) => {
      if (tag.tagGroupId) {
        const tagGroup = mappedTagGroups.find(
          (group) => group.id === tag.tagGroupId,
        );
        if (tagGroup) {
          tagGroup.tags.push(tag);
        }
      } else {
        ungroupedTags.push(tag);
      }
    });

    return {
      ungroupedTags,
      tagGroups: mappedTagGroups,
    };
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tagGroups.list", journalId],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    ungroupedTags: data?.ungroupedTags ?? [],
    tagGroups: data?.tagGroups ?? [],
    refetchTagGroups: refetch,
  };
};
