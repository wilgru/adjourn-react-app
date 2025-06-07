import { getColour } from "src/utils/colours/getColour";
import type { RecordModel } from "pocketbase";
import type { Tag } from "src/types/Tag.type";

export const mapTag = (tag: RecordModel): Tag => {
  return {
    id: tag.id,
    name: tag.name,
    colour: getColour(tag.colour),
    icon: tag.icon,
    description: tag.description ?? null,
    noteCount: tag.totalNotes,
    groupBy: tag.groupBy,
    created: tag.createdAt,
    updated: tag.updatedAt,
  };
};
