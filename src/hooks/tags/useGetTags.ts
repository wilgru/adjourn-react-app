import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapTag } from "src/utils/tags/mapTag";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Tag } from "src/types/Tag.type";

type UseGetTagsResponse = {
  tags: Tag[];
  refetchTags: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Tag[], Error>>;
};

export const useGetTags = (): UseGetTagsResponse => {
  const queryFn = async (): Promise<Tag[]> => {
    const rawTags = await pb
      .collection("tagsWithNoteCounts")
      .getList(undefined, undefined);

    const mappedTags = rawTags.items.map(mapTag);

    return mappedTags;
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tags.list"],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { tags: data ?? [], refetchTags: refetch };
};
