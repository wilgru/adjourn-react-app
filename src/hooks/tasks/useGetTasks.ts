import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { pb } from "src/connections/pocketbase";
import { mapTask } from "src/utils/tasks/mapTask";
import { useCurrentJournalId } from "../useCurrentJournalId";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Task } from "src/types/Task.type";

type UseGetTacksResponse = {
  tasks: Task[];
  refetchTags: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<Task[], Error>>;
};

export const useGetTasks = ({
  isFlagged,
  dateString,
}: {
  isFlagged?: boolean;
  dateString?: string;
}): UseGetTacksResponse => {
  const { journalId } = useCurrentJournalId();

  const queryFn = async (): Promise<Task[]> => {
    const filters = [`journal = '${journalId}'`];

    if (isFlagged !== undefined) {
      filters.push(isFlagged ? "isFlagged = true" : "isFlagged = false");
    }

    if (dateString) {
      const localDateMidday = dayjs(dateString)
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);

      const utcStartOfDate = localDateMidday
        .utc()
        .subtract(12, "hour")
        .format("YYYY-MM-DD HH:mm:ss.SSS[Z]");

      const utcEndOfDate = localDateMidday
        .utc()
        .add(12, "hour")
        .format("YYYY-MM-DD HH:mm:ss.SSS[Z]");

      filters.push(
        `(dueDate != "" && dueDate <= "${utcEndOfDate}" && completedDate = "" && cancelledDate = "") || (completedDate >= "${utcStartOfDate}" && completedDate <= "${utcEndOfDate}") || (cancelledDate >= "${utcStartOfDate}" && cancelledDate <= "${utcEndOfDate}")`,
      );
    }

    const rawTasks = await pb
      .collection("tasks")
      .getList(undefined, undefined, {
        filter: filters.join(" && "),
        expand: "note",
        sort: "-dueDate",
      });

    const mappedTasks = rawTasks.items.map(mapTask);

    return mappedTasks;
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tasks.list", journalId, isFlagged, dateString],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { tasks: data ?? [], refetchTags: refetch };
};
