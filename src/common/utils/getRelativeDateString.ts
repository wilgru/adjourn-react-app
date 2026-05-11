import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export const getRelativeDateTitle = (date: Dayjs): string => {
  const today = dayjs();
  const diffDays = today.diff(date, "day");

  if (diffDays === 0) return `Today, ${date.format("D MMMM")}`;
  if (diffDays === 1) return `Yesterday, ${date.format("D MMMM")}`;
  if (diffDays < 7) return date.format("dddd, D MMMM");
  if (diffDays < 30) return date.format("D MMMM");

  return date.year() !== today.year()
    ? date.format("D MMMM, YYYY")
    : date.format("D MMMM");
};
