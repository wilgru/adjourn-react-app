import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "src/Users/hooks/useUser";
import { mapNote } from "src/notes/utils/mapNote";
import { pb } from "src/pocketbase/utils/connection";
import { useCurrentJournalId } from "../../journals/hooks/useCurrentJournalId";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";

type CreateNoteProps = {
  createNoteData: Omit<
    Note,
    "id" | "created" | "updated" | "deleted" | "tasks"
  >;
};

type UseCreateNoteResponse = {
  createNote: UseMutateAsyncFunction<
    Note | undefined,
    Error,
    CreateNoteProps,
    unknown
  >;
};

export const useCreateNote = (): UseCreateNoteResponse => {
  const { journalId } = useCurrentJournalId();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const mutationFn = async ({
    createNoteData,
  }: CreateNoteProps): Promise<Note | undefined> => {
    const createdNote = await pb.collection("notes").create(
      {
        ...createNoteData,
        tags: createNoteData.tags.map((tag) => tag.id),
        journal: journalId,
        user: user?.id,
      },
      { expand: "tags" },
    );

    return mapNote(createdNote);
  };

  const onSuccess = (data: Note | undefined) => {
    if (!data) {
      return;
    }

    queryClient.refetchQueries({
      queryKey: ["notes.list"],
    });

    queryClient.refetchQueries({
      queryKey: ["tags.get"],
    });
  };

  // TODO: consider time caching for better performance
  const { mutateAsync } = useMutation({
    mutationKey: ["notes.create"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { createNote: mutateAsync };
};
