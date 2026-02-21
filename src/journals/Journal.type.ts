import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";

export type Journal = {
  id: string;
  title: string;
  icon: string;
  colour: Colour;
  created: Dayjs;
  updated: Dayjs;
};
