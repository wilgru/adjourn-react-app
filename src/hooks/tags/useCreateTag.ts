import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { useUser } from "src/hooks/users/useUser";
import { mapTag } from "src/utils/tags/mapTag";
import { useCurrentJournalId } from "../useCurrentJournalId";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Tag } from "src/types/Tag.type";

type CreateTagProps = {
  createTagData: Omit<
    Tag,
    | "id"
    | "journalId"
    | "groupBy"
    | "user"
    | "noteCount"
    | "created"
    | "updated"
  >;
};

type UseCreateTagResponse = {
  createTag: UseMutateAsyncFunction<Tag, Error, CreateTagProps, unknown>;
};

export const useCreateTag = (): UseCreateTagResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createTagData,
  }: CreateTagProps): Promise<Tag> => {
    const newTag = await pb.collection("tags").create({
      ...createTagData,
      colour: createTagData.colour.name,
      topicGroup: createTagData.topicGroupId ?? null,
      journal: journalId,
      user: user?.id,
      groupBy: null,
    });

    const mappedNewTag = mapTag({ ...newTag, totalNotes: 0 });

    return mappedNewTag;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["tags.list"],
    });
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

  return { createTag: mutateAsync };
};
