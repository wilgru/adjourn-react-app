import type { Dayjs } from "dayjs";
import type { Tag } from "storybook/internal/types";

export type Task = {
  id: string;
  title: string;
  description: string;
  link: string | null;
  isFlagged: boolean;
  tags: Tag[];
  dueDate: Dayjs | null;
  completedDate: Dayjs | null;
  cancelledDate: Dayjs | null;
  created: Dayjs;
  updated: Dayjs;
};
