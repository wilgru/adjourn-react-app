import { eq, isNull, sql } from "drizzle-orm";
import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { journals } from "src/journals/journals.schema";
import { notes } from "src/notes/notes.schema";
import { tasks } from "src/tasks/tasks.schema";
import type { JournalSchema } from "src/journals/journals.schema";

export type GetJournalsInput = {
  userId: string | null;
};

export type GetJournalsResult = {
  journals: Array<JournalSchema & { noteCount: number; taskCount: number }>;
};

createIpcHandler(
  "journals:getAll",
  ({ userId }: GetJournalsInput): GetJournalsResult => {
    const rows = db
      .select()
      .from(journals)
      .where(userId ? eq(journals.user, userId) : isNull(journals.user))
      .all();

    const noteCountRows = db
      .select({
        journal: notes.journal,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(notes)
      .where(isNull(notes.deleted))
      .groupBy(notes.journal)
      .all();
    const noteCountMap = new Map(
      noteCountRows.map((r) => [r.journal, r.count]),
    );

    const taskCountRows = db
      .select({
        journal: tasks.journal,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(tasks)
      .groupBy(tasks.journal)
      .all();
    const taskCountMap = new Map(
      taskCountRows.map((r) => [r.journal, r.count]),
    );

    return {
      journals: rows.map((j) => ({
        ...j,
        noteCount: noteCountMap.get(j.id) ?? 0,
        taskCount: taskCountMap.get(j.id) ?? 0,
      })),
    };
  },
);
