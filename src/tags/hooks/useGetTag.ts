import { useQuery } from "@tanstack/react-query";
import { pb } from "src/pocketbase/utils/connection";
import { mapTag } from "src/tags/utils/mapTag";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Tag } from "src/tags/Tag.type";

type UseTagResponse = {
  tag: Tag | undefined;
  refetchTag: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        tag: Tag;
      },
      Error
    >
  >;
};

export const useGetTag = (tagId: string): UseTagResponse => {
  const queryFn = async (): Promise<{
    tag: Tag;
  }> => {
    const rawTag = await pb.collection("tags").getOne(tagId);
    const tag: Tag = mapTag({
      ...rawTag,
      totalNotes: rawTag.expand?.notes_via_tags?.length ?? 0,
    });

    return {
      tag,
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
    refetchTag: refetch,
  };
};
