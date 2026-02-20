import type { Note } from "./Note.type";
import type { Dayjs } from "dayjs";

export type Task = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  isFlagged: boolean;
  note: Note | null;
  dueDate: Dayjs | null;
  completedDate: Dayjs | null;
  cancelledDate: Dayjs | null;
  created: Dayjs;
  updated: Dayjs;
};

export type TasksGroup = {
  title: string;
  tasks: Task[];
  relevantTaskData: Partial<Task>;
};
