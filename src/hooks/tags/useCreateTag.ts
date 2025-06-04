import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { useUser } from "src/hooks/users/useUser";
import { mapTag } from "src/utils/tags/mapTag";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Tag } from "src/types/Tag.type";

type UseCreateTagResponse = {
  createTag: UseMutateAsyncFunction<Tag, Error, string, unknown>;
};

export const useCreateTag = (): UseCreateTagResponse => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async (tagName: string): Promise<Tag> => {
    const newTag = await pb.collection("tags").create({
      name: tagName,
      colour: "orange",
      icon: "tag",
      user: user?.id,
      groupBy: null,
    });

    const mappedNewTag = mapTag({ ...newTag, totalSlips: 0 });

    return mappedNewTag;
  };

  const onSuccess = () => {
    queryClient.refetchQueries({
      queryKey: ["tags.list"],
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
