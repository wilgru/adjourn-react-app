import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";
import { mapTagGroup } from "src/tags/utils/mapTagGroup";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { TagGroup } from "src/tags/Tag.type";

type CreateTagGroupProps = {
  createTagGroupData: Omit<
    TagGroup,
    | "id"
    | "tags"
    | "journalId"
    | "groupBy"
    | "user"
    | "noteCount"
    | "created"
    | "updated"
  >;
};

type UseCreateTagGroupResponse = {
  createTagGroup: UseMutateAsyncFunction<
    TagGroup,
    Error,
    CreateTagGroupProps,
    unknown
  >;
};

export const useCreateTagGroup = (): UseCreateTagGroupResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createTagGroupData,
  }: CreateTagGroupProps): Promise<TagGroup> => {
    const newTagGroup = await pb.collection("tagGroups").create({
      ...createTagGroupData,
      journal: journalId,
      user: user?.id,
      groupBy: null,
    });

    const mappedNewTagGroup = mapTagGroup({
      ...newTagGroup,
      totalNotes: 0,
    });

    return mappedNewTagGroup;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["tagGroups.list"],
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

  return { createTagGroup: mutateAsync };
};
