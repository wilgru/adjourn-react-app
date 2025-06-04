import dayjs from "dayjs";
import { mapTag } from "../tags/mapTag";
import type { RecordModel } from "pocketbase";
import type { Task } from "src/types/Task.type";

export const mapTask = (task: RecordModel): Task => {
  return {
    id: task.id,
    title: task.title,
    description: task.description || null,
    link: task.link || null,
    isFlagged: task.isFlagged || false,
    tags: task?.expand?.tags ? task.expand.tags.map(mapTag) : [],
    dueDate: task.dueDate ? dayjs(task.dueDate) : null,
    completedDate: task.completedDate ? dayjs(task.completedDate) : null,
    cancelledDate: task.cancelledDate ? dayjs(task.cancelledDate) : null,
    created: dayjs(task.created),
    updated: dayjs(task.updated),
  };
};
