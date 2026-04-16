import type { UpdateSchema } from "./updates.schema";
import type { Dayjs } from "dayjs";
import type Delta from "quill-delta";
import type { Prettify } from "src/common/types/Prettify.type";
import type { Note } from "src/notes/Note.type";

export type UpdateTint = "red" | "yellow" | "green" | "blue";

export type Update = Prettify<Omit<
  UpdateSchema,
  "content" | "tint" | "pocketbook" | "user" | "created" | "updated"
> & {
  content: Delta;
  tint: UpdateTint | null;
  notes: Note[];
  created: Dayjs;
  updated: Dayjs;
}>;

export type UpdatesGroup = {
  title: string;
  updates: Update[];
};
