import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapSlip } from "src/utils/slips/mapSlip";
import type { TableOfContentsItem } from "src/components/TableOfContents/TableOfContents";
import type { Slip } from "src/types/Slip.type";

type UseGetSlipsResponse = {
  slips: Slip[];
  tableOfContentItems: TableOfContentsItem[];
};

export const useGetSlips = ({
  isFlagged,
}: {
  isFlagged: boolean;
}): UseGetSlipsResponse => {
  const queryFn = async (): Promise<{
    slips: Slip[];
    tableOfContentItems: TableOfContentsItem[];
  }> => {
    const filter = `deleted = null ${isFlagged ? "&& isFlagged = true" : ""}`;

    const rawSlips = await pb
      .collection("slips")
      .getList(undefined, undefined, {
        filter,
        expand: "journals",
        sort: "-isPinned",
      });

    const slips = rawSlips.items.map(mapSlip);

    const tableOfContentItems: TableOfContentsItem[] = slips.map((slip) => ({
      title: slip.title ?? "No Title",
      italic: slip.title ? false : true,
      navigationId: slip.id,
      subItems: [],
    }));

    return { slips, tableOfContentItems };
  };

  // TODO: consider time caching for better performance
  const { data } = useQuery({
    queryKey: ["slips.list", isFlagged],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    slips: data?.slips ?? [],
    tableOfContentItems: data?.tableOfContentItems ?? [],
  };
};
