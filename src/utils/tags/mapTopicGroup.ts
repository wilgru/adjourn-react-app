import type { RecordModel } from "pocketbase";
import type { TopicGroup } from "src/types/Tag.type";

export const mapTopicGroup = (topicGroup: RecordModel): TopicGroup => {
  return {
    id: topicGroup.id,
    title: topicGroup.title,
    topics: [],
    created: topicGroup.createdAt,
    updated: topicGroup.updatedAt,
  };
};
