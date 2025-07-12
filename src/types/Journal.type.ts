import type { Colour } from "./Colour.type";
import type { Dayjs } from "dayjs";

export type Journal = {
  id: string;
  title: string;
  icon: string;
  colour: Colour;
  created: Dayjs;
  updated: Dayjs;
};
