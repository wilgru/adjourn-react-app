import { useQuery } from "@tanstack/react-query";
import { mapJournal } from "src/journals/utils/mapJournal";
import { pb } from "src/pocketbase/utils/connection";
import type { Journal } from "src/journals/Journal.type";

type UseGetJournalsResponse = {
  journals: Journal[];
  isFetching: boolean;
};

export const useGetJournals = (): UseGetJournalsResponse => {
  const queryFn = async (): Promise<{
    journals: Journal[];
  }> => {
    const rawJournals = await pb
      .collection("journals")
      .getList(undefined, undefined);

    const journals = rawJournals.items.map(mapJournal);

    return { journals };
  };

  // TODO: consider time caching for better performance
  const { data, isFetching } = useQuery({
    queryKey: ["journals.list"],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return {
    journals: data?.journals ?? [],
    isFetching,
  };
};
