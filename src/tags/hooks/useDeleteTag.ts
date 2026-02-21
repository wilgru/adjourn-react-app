import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/pocketbase/utils/connection";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

type UseDeleteTagResponse = {
  deleteTag: UseMutateAsyncFunction<string | undefined, Error, string, unknown>;
};

export const useDeleteTag = (): UseDeleteTagResponse => {
  const queryClient = useQueryClient();

  const mutationFn = async (tagId: string): Promise<string | undefined> => {
    const isTagDeleted = await pb.collection("tags").delete(tagId);

    if (isTagDeleted) {
      return tagId;
    }

    return undefined;
  };

  const onSuccess = (data: string | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tags.list"],
    });

    // remove tag from any notes
    queryClient.refetchQueries({
      queryKey: ["notes.list"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tags.delete"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { deleteTag: mutateAsync };
};
