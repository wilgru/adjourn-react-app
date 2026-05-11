import { getRelativeDateTitle } from "src/common/utils/getRelativeDateString";
import type { Update, UpdatesGroup } from "src/updates/Update.type";

export const groupUpdates = (updates: Update[]): UpdatesGroup[] => {
  const groupedUpdates = updates.reduce(
    (acc: UpdatesGroup[], update: Update) => {
      const title = getRelativeDateTitle(update.created);
      const existingGroup = acc.find((group) => group.title === title);

      if (existingGroup) {
        existingGroup.updates.push(update);
      } else {
        acc.push({
          title,
          updates: [update],
        });
      }

      return acc;
    },
    [],
  );

  // Sort each group's updates newest-first, then sort groups newest-first.
  groupedUpdates.forEach((group) => {
    group.updates.sort((a, b) => b.created.valueOf() - a.created.valueOf());
  });

  groupedUpdates.sort(
    (a, b) => b.updates[0].created.valueOf() - a.updates[0].created.valueOf(),
  );

  return groupedUpdates;
};
