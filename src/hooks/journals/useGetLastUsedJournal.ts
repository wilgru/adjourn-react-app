import { useGetJournals } from "./useGetJournals";
import type { Journal } from "src/types/Journal.type";

export const useNavigateToLastUsedJournal = (): {
  lastUsedJournal: Journal | null;
  isFetching: boolean;
} => {
  const { journals, isFetching } = useGetJournals();

  const lastUsedJournalId =
    typeof window !== "undefined"
      ? localStorage.getItem("lastUsedJournalId")
      : null;

  if (journals.length === 0) {
    return { lastUsedJournal: null, isFetching };
  }

  const lastUsedJournal = !lastUsedJournalId
    ? null
    : (journals.find((journal) => journal.id === lastUsedJournalId) ?? null);

  if (!lastUsedJournal) {
    const firstJournal = journals[0];
    localStorage.setItem("lastUsedJournalId", firstJournal.id);

    return { lastUsedJournal: firstJournal, isFetching };
  }

  return { lastUsedJournal, isFetching };
};
