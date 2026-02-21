import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useCurrentJournalId } from "src/journals/hooks/useCurrentJournalId";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { Note } from "src/notes/Note.type";

type CreateNoteDraftProps = {
  createNoteDraftData: Omit<
    Note,
    "id" | "created" | "updated" | "deleted" | "tasks"
  >;
};

type UseCreateNoteResponse = {
  createNoteDraft: UseMutateAsyncFunction<
    Note | undefined,
    Error,
    CreateNoteDraftProps,
    unknown
  >;
};

export const useCreateNoteDraft = ({
  isFlagged,
  tagId,
}: {
  isFlagged?: boolean;
  tagId?: string;
}): UseCreateNoteResponse => {
  const queryClient = useQueryClient();
  const { journalId } = useCurrentJournalId();
  // const { user } = useUser();

  const mutationFn = async ({
    createNoteDraftData,
  }: CreateNoteDraftProps): Promise<Note | undefined> => {
    const now = dayjs();
    const newNote: Note = {
      ...createNoteDraftData,
      id: nanoid(15),
      created: now,
      updated: now,
      deleted: null,
      tasks: [],
    };

    return newNote;
  };

  const onSuccess = (data: Note | undefined) => {
    if (!data) {
      return;
    }

    queryClient.setQueryData(
      ["notes.list", journalId, isFlagged, undefined, tagId],
      (oldData: { notes: Note[] } | undefined) => {
        if (!oldData) {
          return { notes: [data] };
        }

        return {
          notes: [data, ...oldData.notes],
        };
      },
    );

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

  return { createNoteDraft: mutateAsync };
};
