import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { useUser } from "src/hooks/users/useUser";
import { mapTask } from "src/utils/tasks/mapTask";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Task } from "src/types/Task.type";

type CreateTaskProps = {
  createTaskData: Omit<Task, "id" | "created" | "updated">;
};

type UseCreateTaskResponse = {
  createTask: UseMutateAsyncFunction<
    Task | undefined,
    Error,
    CreateTaskProps,
    unknown
  >;
};

export const useCreateTask = (): UseCreateTaskResponse => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createTaskData,
  }: CreateTaskProps): Promise<Task | undefined> => {
    const createdTask = await pb.collection("tasks").create(
      {
        ...createTaskData,
        tags: createTaskData.tags.map((tag) => tag.id),
        user: user?.id,
      },
      { expand: "tags" }
    );

    return mapTask(createdTask);
  };

  const onSuccess = (data: Task | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["tasks.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["tasks.create"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { createTask: mutateAsync };
};
