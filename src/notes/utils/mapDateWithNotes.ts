import dayjs from "dayjs";
import type { RecordModel } from "pocketbase";
import type { DateWithNotes } from "src/notes/Note.type";

export const mapDateWithNotes = (dateWithNotes: RecordModel): DateWithNotes => {
  return {
    id: dateWithNotes.id,
    created: dayjs(dateWithNotes.created),
    hasBookmarked: dateWithNotes.hasBookmarked === 1 ? true : false,
  };
};
