import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapTask } from "src/utils/tasks/mapTask";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Task } from "src/types/Task.type";

type UpdateTaskProps = {
  taskId: string;
  updateTaskData: Task;
};

type UseUpdateTaskResponse = {
  updateTask: UseMutateAsyncFunction<
    Task | undefined,
    Error,
    UpdateTaskProps,
    unknown
  >;
};

export const useUpdateTask = (): UseUpdateTaskResponse => {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    taskId,
    updateTaskData,
  }: UpdateTaskProps): Promise<Task | undefined> => {
    const tagIds = updateTaskData.tags.map((tag) => tag.id);

    const rawUpdatedTask = await pb.collection("tasks").update(taskId, {
      ...updateTaskData,
      tags: tagIds,
    });

    return mapTask(rawUpdatedTask);
  };

  const onSuccess = (data: Task | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tasks.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tasks.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tasks.update"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { updateTask: mutateAsync };
};
