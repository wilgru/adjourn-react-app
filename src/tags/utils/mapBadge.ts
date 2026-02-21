import type { RecordModel } from "pocketbase";
import type { TagBadge } from "src/tags/Tag.type";

export const mapBadge = (badge: RecordModel): TagBadge => {
  return {
    id: badge.id,
    title: badge.title,
    link: badge.link ?? undefined,
  };
};
