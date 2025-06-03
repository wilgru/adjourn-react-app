import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapSlip } from "src/utils/slips/mapSlip";
import { mapTag } from "src/utils/tags/mapTag";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Slip } from "src/types/Slip.type";
import type { Tag } from "src/types/Tag.type";

type UseTagResponse = {
  tag: Tag | undefined;
  slips: Slip[];
  refetchTag: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        tag: Tag;
        slips: Slip[];
      },
      Error
    >
  >;
};

export const useGetTag = (tagId: string): UseTagResponse => {
  const queryFn = async (): Promise<{
    tag: Tag;
    slips: Slip[];
  }> => {
    const rawTag = await pb.collection("tags").getOne(tagId, {
      expand: "slips_via_tags, slips_via_tags.tags",
    });

    const tag: Tag = mapTag({
      ...rawTag,
      totalSlips: rawTag.expand?.slips_via_tags?.length ?? 0,
    });

    const rawSlips = rawTag.expand?.slips_via_tags ?? [];
    const slips: Slip[] = rawSlips.map(mapSlip);

    return {
      tag,
      slips,
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
    slips: data?.slips ?? [],
    refetchTag: refetch,
  };
};
