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
  createdDateString,
}: {
  isFlagged: boolean;
  createdDateString?: string;
}): UseGetTacksResponse => {
  const queryFn = async (): Promise<Task[]> => {
    let filter = isFlagged ? "isFlagged = true" : "";
    if (createdDateString) {
      const startOfDay = `${createdDateString} 00:00:00.000Z`;
      const endOfDay = `${createdDateString} 23:59:59.999Z`;
      filter += ` && created >= "${startOfDay}" && created <= "${endOfDay}"`;
    }

    const rawTags = await pb
      .collection("tasks")
      .getList(undefined, undefined, { filter, expand: "tags" });

    const mappedTasks = rawTags.items.map(mapTask);

    return mappedTasks;
  };

  // TODO: consider time caching for better performance
  const { data, refetch } = useQuery({
    queryKey: ["tasks.list"],
    queryFn,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { tasks: data ?? [], refetchTags: refetch };
};
