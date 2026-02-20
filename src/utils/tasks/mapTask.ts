import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { mapNote } from "../notes/mapNote";
import type { RecordModel } from "pocketbase";
import type { Task } from "src/types/Task.type";

dayjs.extend(utc);

export const mapTask = (task: RecordModel): Task => {
  return {
    id: task.id,
    title: task.title,
    description: task.description || null,
    link: task.link || null,
    isFlagged: task.isFlagged || false,
    note: task?.expand?.note ? mapNote(task.expand.note) : null,
    dueDate: task.dueDate ? dayjs.utc(task.dueDate).local() : null,
    completedDate: task.completedDate
      ? dayjs.utc(task.completedDate).local()
      : null,
    cancelledDate: task.cancelledDate
      ? dayjs.utc(task.cancelledDate).local()
      : null,
    created: dayjs.utc(task.created).local(),
    updated: dayjs(task.updated).local(),
  };
};
