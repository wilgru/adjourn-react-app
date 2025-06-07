import { useQuery } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapTask } from "src/utils/tasks/mapTask";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import type { Task } from "src/types/Task.type";

type UseGetTacksResponse = {
  tasks: Task[];
  refetchTags: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Task[], Error>>;
};

export const useGetTasks = ({
  isFlagged,
  dateString,
}: {
  isFlagged?: boolean;
  dateString?: string;
}): UseGetTacksResponse => {
  const queryFn = async (): Promise<Task[]> => {
    const filters = [];

    if (isFlagged !== undefined) {
      filters.push(isFlagged ? "isFlagged = true" : "isFlagged = false");
    }

    if (dateString) {
      const startOfGivenDate = `${dateString} 00:00:00.000Z`;
      const endOfGivenDate = `${dateString} 23:59:59.999Z`;

      filters.push(
        `(dueDate <= "${endOfGivenDate}" && completedDate = "" && cancelledDate = "") || (completedDate >= "${startOfGivenDate}" && completedDate <= "${endOfGivenDate}") || (cancelledDate >= "${startOfGivenDate}" && cancelledDate <= "${endOfGivenDate}")`
      );
    }

    const rawTags = await pb.collection("tasks").getList(undefined, undefined, {
      filter: filters.join(" && "),
      expand: "tags",
      sort: "-dueDate",
    });

    const mappedTasks = rawTags.items.map(mapTask);

    return mappedTasks;
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tasks.list", isFlagged, dateString],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { tasks: data ?? [], refetchTags: refetch };
};
