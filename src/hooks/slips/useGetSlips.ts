import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapSlip } from "src/utils/slips/mapSlip";
import type { Slip } from "src/types/Slip.type";

type UseGetSlipsResponse = {
  slips: Slip[];
};

export const useGetSlips = ({
  isFlagged,
  createdDateString,
}: {
  isFlagged: boolean;
  createdDateString?: string;
}): UseGetSlipsResponse => {
  const queryFn = async (): Promise<{
    slips: Slip[];
  }> => {
    let filter = `deleted = null${isFlagged ? " && isFlagged = true" : ""}`;
    if (createdDateString) {
      const startOfDay = `${createdDateString} 00:00:00.000Z`;
      const endOfDay = `${createdDateString} 23:59:59.999Z`;
      filter += ` && created >= "${startOfDay}" && created <= "${endOfDay}"`;
    }

    const rawSlips = await pb
      .collection("slips")
      .getList(undefined, undefined, {
        filter,
        expand: "tags",
        sort: "-isPinned",
      });

    const slips = rawSlips.items.map(mapSlip);

    return { slips };
  };

  // TODO: consider time caching for better performance
  const { data } = useQuery({
    queryKey: ["slips.list", isFlagged, createdDateString],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    slips: data?.slips ?? [],
  };
};
