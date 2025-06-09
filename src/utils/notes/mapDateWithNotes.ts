import dayjs from "dayjs";
import type { RecordModel } from "pocketbase";
import type { DateWithNotes } from "src/types/Note.type";

export const mapDateWithNotes = (dateWithNotes: RecordModel): DateWithNotes => {
  return {
    id: dateWithNotes.id,
    created: dayjs(dateWithNotes.created),
    hasFlagged: dateWithNotes.hasFlagged === 1 ? true : false,
  };
};
