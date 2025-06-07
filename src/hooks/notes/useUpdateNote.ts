import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "src/connections/pocketbase";
import { mapNote } from "src/utils/notes/mapNote";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Note } from "src/types/Note.type";

type UpdateNoteProps = {
  noteId: string;
  updateNoteData: Note;
};

type UseUpdateNoteResponse = {
  updateNote: UseMutateAsyncFunction<
    Note | undefined,
    Error,
    UpdateNoteProps,
    unknown
  >;
};

export const useUpdateNote = (): UseUpdateNoteResponse => {
  const queryClient = useQueryClient();

  const mutationFn = async ({
    noteId,
    updateNoteData,
  }: UpdateNoteProps): Promise<Note | undefined> => {
    const tagIds = updateNoteData.tags.map((tag) => tag.id);

    const updatedNote = await pb
      .collection("notes")
      .update(noteId, { ...updateNoteData, tags: tagIds }, { expand: "tags" });

    return mapNote(updatedNote);
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
    mutationKey: ["notes.update"],
    mutationFn,
    onSuccess,
    // staleTime: 2 * 60 * 1000,
    // gcTime: 2 * 60 * 1000,
  });

  return { updateNote: mutateAsync };
};
