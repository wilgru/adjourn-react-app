import { useQuery } from "@tanstack/react-query";
import { mapDateWithNotes } from "src/notes/utils/mapDateWithNotes";
import { pb } from "src/pocketbase/utils/connection";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { DateWithNotes } from "src/notes/Note.type";

type UseGetDatesWithNotesResponse = {
  datesWithNotes: DateWithNotes[];
  refetchDatesWithNotes: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<DateWithNotes[], Error>>;
};

export const useGetDatesWithNotes = (): UseGetDatesWithNotesResponse => {
  const queryFn = async (): Promise<DateWithNotes[]> => {
    const rawDatesWithNotes = await pb
      .collection("datesWithNotes")
      .getList(undefined, undefined);

    const mappedDatesWithNotes = rawDatesWithNotes.items.map(mapDateWithNotes);

    return mappedDatesWithNotes;
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["datesWithNotes.list"],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { datesWithNotes: data ?? [], refetchDatesWithNotes: refetch };
};
