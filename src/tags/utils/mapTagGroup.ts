import type { RecordModel } from "pocketbase";
import type { TagGroup } from "src/tags/Tag.type";

export const mapTagGroup = (tagGroup: RecordModel): TagGroup => {
  return {
    id: tagGroup.id,
    title: tagGroup.title,
    tags: [],
    created: tagGroup.createdAt,
    updated: tagGroup.updatedAt,
  };
};
