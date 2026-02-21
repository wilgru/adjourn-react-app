import type { Dayjs } from "dayjs";
import type { Note } from "src/notes/Note.type";

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
