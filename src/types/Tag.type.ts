import type { Dayjs } from "dayjs";
import type { Colour } from "src/types/Colour.type";

export type Tag = {
  id: string;
  name: string;
  colour: Colour;
  icon: string;
  noteCount: number;
  groupBy: "created" | "tag" | null;
  created: Dayjs;
  updated: Dayjs;
};
