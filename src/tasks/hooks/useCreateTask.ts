import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import { pb } from "src/pocketbase/utils/connection";
import { mapTask } from "src/tasks/utils/mapTask";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Task } from "src/tasks/Task.type";

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
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createTaskData,
  }: CreateTaskProps): Promise<Task | undefined> => {
    const createdTask = await pb.collection("tasks").create(
      {
        ...createTaskData,
        note: createTaskData.note?.id,
        journal: journalId,
        user: user?.id,
      },
      { expand: "note" },
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
