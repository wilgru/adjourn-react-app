import { createIpcHandler } from "src/common/utils/createIpcHandler";
import { db } from "src/db/connection";
import { tasks } from "src/tasks/tasks.schema";
import type { TaskSchema } from "src/tasks/tasks.schema";

export type CreateTaskInput = {
  title: string;
  description: string;
  link: string | null;
  links: string;
  isFlagged: boolean;
  noteId: string | null;
  dueDate: string | null;
  pocketbookId: string | null;
  userId: string | null;
};

createIpcHandler(
  "tasks:create",
  ({
    title,
    description,
    link,
    links,
    isFlagged,
    noteId,
    dueDate,
    pocketbookId,
    userId,
  }: CreateTaskInput): TaskSchema => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const [inserted] = db
      .insert(tasks)
      .values({
        id,
        title,
        description,
        link,
        links,
        isFlagged,
        note: noteId,
        dueDate,
        pocketbook: pocketbookId,
        user: userId,
        created: now,
        updated: now,
      })
      .returning()
      .all();

    return inserted;
  },
);
