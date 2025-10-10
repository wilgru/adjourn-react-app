import type { Dayjs } from "dayjs";
import type { Colour } from "src/types/Colour.type";

export type TagBadge = {
  id: string;
  title: string;
  link?: string;
};

export type Tag = {
  id: string;
  name: string;
  colour: Colour;
  icon: string;
  description: string | null;
  noteCount: number;
  groupBy: "created" | "tag" | null;
  badges: TagBadge[];
  created: Dayjs;
  updated: Dayjs;
};
