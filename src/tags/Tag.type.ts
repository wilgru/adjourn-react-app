import type { Dayjs } from "dayjs";
import type { Colour } from "src/colours/Colour.type";

export type TopicGroup = {
  id: string;
  title: string;
  topics: Tag[];
  created: Dayjs;
  updated: Dayjs;
};

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
  topicGroupId: string | null;
  created: Dayjs;
  updated: Dayjs;
};
