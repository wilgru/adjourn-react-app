import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { useUser } from "src/hooks/users/useUser";
import { mapTopicGroup } from "src/utils/tags/mapTopicGroup";
import { useCurrentJournalId } from "../useCurrentJournalId";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { TopicGroup } from "src/types/Tag.type";

type CreateTopicGroupProps = {
  createTopicGroupData: Omit<
    TopicGroup,
    | "id"
    | "topics"
    | "journalId"
    | "groupBy"
    | "user"
    | "noteCount"
    | "created"
    | "updated"
  >;
};

type UseCreateTopicGroupResponse = {
  createTopicGroup: UseMutateAsyncFunction<
    TopicGroup,
    Error,
    CreateTopicGroupProps,
    unknown
  >;
};

export const useCreateTopicGroup = (): UseCreateTopicGroupResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createTopicGroupData,
  }: CreateTopicGroupProps): Promise<TopicGroup> => {
    const newTopicGroup = await pb.collection("topicGroups").create({
      ...createTopicGroupData,
      journal: journalId,
      user: user?.id,
      groupBy: null,
    });

    const mappedNewTopicGroup = mapTopicGroup({
      ...newTopicGroup,
      totalNotes: 0,
    });

    return mappedNewTopicGroup;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["topicGroups.list"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tags.create"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { createTopicGroup: mutateAsync };
};
