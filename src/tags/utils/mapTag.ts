import { getColour } from "src/colours/utils/getColour";
import type { RecordModel } from "pocketbase";
import type { Tag } from "src/tags/Tag.type";

export const mapTag = (tag: RecordModel): Tag => {
  return {
    id: tag.id,
    name: tag.name,
    colour: getColour(tag.colour),
    icon: tag.icon,
    description: tag.description ?? null,
    noteCount: tag.totalNotes,
    badges: tag.badges || [],
    groupBy: tag.groupBy,
    tagGroupId: tag.tagGroup || null,
    created: tag.createdAt,
    updated: tag.updatedAt,
  };
};
