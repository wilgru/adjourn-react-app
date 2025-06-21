import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import Delta from "quill-delta";
import { mapTag } from "../tags/mapTag";
import type { RecordModel } from "pocketbase";
import type { Note } from "src/types/Note.type";

dayjs.extend(utc);

export const mapNote = (note: RecordModel): Note => {
  return {
    id: note.id,
    isDraft: false,
    title: note.title,
    content: note.content ? new Delta(note.content) : new Delta(), // TODO: make not nullable in pocketbase
    isPinned: note.isPinned,
    isFlagged: note.isFlagged,
    tags: note?.expand?.tags ? note.expand.tags.map(mapTag) : [],
    deleted: null,
    created: dayjs.utc(note.created).local(),
    updated: dayjs.utc(note.updated).local(),
  };
};
