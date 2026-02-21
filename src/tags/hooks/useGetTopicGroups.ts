import { useQuery } from "@tanstack/react-query";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";
import { mapTag } from "src/tags/utils/mapTag";
import { mapTopicGroup } from "src/tags/utils/mapTopicGroup";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Tag, TopicGroup } from "src/tags/Tag.type";

type UseGetTopicGroupsResponse = {
  ungroupedTopics: Tag[];
  topicGroups: TopicGroup[];
  refetchTopicGroups: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        ungroupedTopics: Tag[];
        topicGroups: TopicGroup[];
      },
      Error
    >
  >;
};

export const useGetTopicGroups = (): UseGetTopicGroupsResponse => {
  const { journalId } = useCurrentJournalId();

  const queryFn = async (): Promise<{
    ungroupedTopics: Tag[];
    topicGroups: TopicGroup[];
  }> => {
    const filters = [`journal = '${journalId}'`];

    const rawTopicGroups = await pb
      .collection("topicGroups")
      .getList(undefined, undefined, {
        filter: filters.join(" && "),
      });
    const mappedTopicGroups = rawTopicGroups.items.map(mapTopicGroup);

    const rawTopics = await pb
      .collection("tagsWithNoteCounts")
      .getList(undefined, undefined, {
        filter: filters.join(" && "),
      });
    const mappedTopics = rawTopics.items.map(mapTag);

    const ungroupedTopics: Tag[] = [];
    mappedTopics.forEach((topic) => {
      if (topic.topicGroupId) {
        const topicGroup = mappedTopicGroups.find(
          (group) => group.id === topic.topicGroupId,
        );
        if (topicGroup) {
          topicGroup.topics.push(topic);
        }
      } else {
        ungroupedTopics.push(topic);
      }
    });

    return {
      ungroupedTopics,
      topicGroups: mappedTopicGroups,
    };
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["topicGroups.list", journalId],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    ungroupedTopics: data?.ungroupedTopics ?? [],
    topicGroups: data?.topicGroups ?? [],
    refetchTopicGroups: refetch,
  };
};
