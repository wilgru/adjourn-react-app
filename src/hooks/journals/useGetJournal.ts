import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapJournal } from "src/utils/journals/mapJournal";
import { mapSlip } from "src/utils/slips/mapSlip";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { TableOfContentsItem } from "src/components/TableOfContents/TableOfContents";
import type { Journal } from "src/types/Journal.type";
import type { Slip } from "src/types/Slip.type";

type UseJournalResponse = {
  journal: Journal | undefined;
  slips: Slip[];
  tableOfContentItems: TableOfContentsItem[];
  refetchJournal: (options?: RefetchOptions | undefined) => Promise<
    QueryObserverResult<
      {
        journal: Journal;
        slips: Slip[];
      },
      Error
    >
  >;
};

export const useGetJournal = (journalId: string): UseJournalResponse => {
  const queryFn = async (): Promise<{
    journal: Journal;
    slips: Slip[];
    tableOfContentItems: TableOfContentsItem[];
  }> => {
    const rawJournal = await pb.collection("journals").getOne(journalId, {
      expand: "slips_via_journals, slips_via_journals.journals",
    });

    const journal: Journal = mapJournal({
      ...rawJournal,
      totalSlips: rawJournal.expand?.slips_via_journals?.length ?? 0,
    });

    const rawSlips = rawJournal.expand?.slips_via_journals ?? [];
    const slips: Slip[] = rawSlips.map(mapSlip);

    const tableOfContentItems: TableOfContentsItem[] = slips.map((slip) => ({
      title: slip.title ?? "No Title",
      italic: slip.title ? false : true,
      navigationId: slip.id,
      subItems: [],
    }));

    return {
      journal,
      slips,
      tableOfContentItems,
    };
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["journals.get", journalId],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    journal: data?.journal,
    slips: data?.slips ?? [],
    tableOfContentItems: data?.tableOfContentItems ?? [],
    refetchJournal: refetch,
  };
};
