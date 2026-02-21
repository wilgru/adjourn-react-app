import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import Delta from "quill-delta";
import { mapTag } from "../../tags/utils/mapTag";
import { mapTask } from "../../tasks/utils/mapTask";
import type { RecordModel } from "pocketbase";
import type { Note } from "src/notes/Note.type";

dayjs.extend(utc);

export const mapNote = (note: RecordModel): Note => {
  return {
    id: note.id,
    isDraft: false,
    title: note.title,
    tasks: note?.expand?.tasks_via_note
      ? note.expand.tasks_via_note.map(mapTask)
      : [],
    content: note.content ? new Delta(note.content) : new Delta(), // TODO: make not nullable in pocketbase
    isPinned: note.isPinned,
    isFlagged: note.isFlagged,
    tags: note?.expand?.tags ? note.expand.tags.map(mapTag) : [],
    deleted: null,
    created: dayjs.utc(note.created).local(),
    updated: dayjs.utc(note.updated).local(),
  };
};
