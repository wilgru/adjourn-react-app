import type { Dayjs } from "dayjs";
import type { Colour } from "src/types/Colour.type";

export type Tag = {
  id: string;
  name: string;
  colour: Colour;
  icon: string;
  slipCount: number;
  groupBy: "created" | "tag";
  created: Dayjs;
  updated: Dayjs;
};
