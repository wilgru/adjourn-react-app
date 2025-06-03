import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { useGetTags } from "src/hooks/tags/useGetTags";
import { mapTag } from "src/utils/tags/mapTag";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { SlipsGroup } from "src/types/Slip.type";
import type { Tag } from "src/types/Tag.type";

type UpdateTagProps = {
  tagId: string;
  updateTagData: Tag;
};

type UseUpdateTagResponse = {
  updateTag: UseMutateAsyncFunction<
    Tag | undefined,
    Error,
    UpdateTagProps,
    unknown
  >;
};

export const useUpdateTag = (): UseUpdateTagResponse => {
  const queryClient = useQueryClient();
  const { tags } = useGetTags();

  const mutationFn = async ({
    tagId,
    updateTagData,
  }: UpdateTagProps): Promise<Tag | undefined> => {
    // TODO: redundant?
    const tagToUpdate = tags.find((tag) => tag.id === tagId);

    if (!tagToUpdate) {
      return;
    }

    const rawUpdatedTag = await pb.collection("tags").update(tagId, {
      ...updateTagData,
      colour: updateTagData.colour.name,
    });

    return mapTag(rawUpdatedTag);
  };

  const onSuccess = (data: Tag | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tags.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.get"],
    });

    // update tag in any slips that have it
    queryClient.setQueryData(
      ["slips.list"],
      (currentSlipGroups: SlipsGroup[]) => {
        return currentSlipGroups.map((currentSlipGroup) => {
          return currentSlipGroup.slips.map((slip) => {
            return slip.tags.map((tag) => {
              if (tag.id === data.id) {
                return data;
              }

              return tag;
            });
          });
        });
      }
    );
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tags.update"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { updateTag: mutateAsync };
};
