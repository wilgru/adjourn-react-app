import type { Slip, SlipsGroup } from "src/types/Slip.type";

const getGroupTitle = (
  slip: Slip,
  groupBy: "created" | "tag",
  defaultGroupTitle: string | undefined = undefined
) => {
  switch (groupBy) {
    case "created":
      return [slip.created.format("ddd D MMMM YYYY")];
    case "tag":
      if (
        slip.tags.length === 1 &&
        slip.tags.at(0)?.name === defaultGroupTitle
      ) {
        return ["Notes"];
      }

      return slip.tags.reduce((acc: string[], tag) => {
        if (tag.name === defaultGroupTitle) {
          return acc;
        }

        return [...acc, tag.name];
      }, []);

    default:
      return [];
  }
};

export function groupSlips(
  slips: Slip[],
  groupBy: "created" | "tag",
  defaultGroupTitle: string | undefined = undefined
): SlipsGroup[] {
  const groupedSlips = slips.reduce((acc: SlipsGroup[], slip: Slip) => {
    const groupTitles = getGroupTitle(slip, groupBy, defaultGroupTitle);

    for (const groupTitle of groupTitles) {
      const existingGroup = acc.find(
        (accGroup) => accGroup.title === groupTitle
      );

      if (existingGroup) {
        existingGroup.slips.push(slip);
      } else {
        const newGroup = {
          title: groupTitle,
          slips: [slip],
        };

        acc.push(newGroup);
      }
    }

    return acc;
  }, []);

  return groupedSlips;
}
