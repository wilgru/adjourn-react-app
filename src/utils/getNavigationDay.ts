import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export const getNavigationDay = (date?: Dayjs): string => {
  const dateObj = date || dayjs();

  return dateObj.format("YYYY-MM-DD");
};
