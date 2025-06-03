import type {
  Slip,
  SlipsGroup,
  SlipsGroupDividedByTitle,
} from "src/types/Slip.type";

const getGroupTitle = (slip: Slip, groupBy: "created" | "tag") => {
  switch (groupBy) {
    case "created":
      return [slip.created.format("ddd D MMMM YYYY")];

    case "tag":
      return slip.tags.map((tag) => tag.name);

    default:
      return [];
  }
};

export function groupSlips(
  slips: Slip[],
  groupBy: "created" | "tag",
  divideByTitle: true
): SlipsGroupDividedByTitle[];
export function groupSlips(
  slips: Slip[],
  groupBy: "created" | "tag",
  divideByTitle?: false
): SlipsGroup[];
export function groupSlips(
  slips: Slip[],
  groupBy: "created" | "tag",
  divideByTitle: boolean = false
): (SlipsGroup | SlipsGroupDividedByTitle)[] {
  const groupedSlips = slips.reduce((acc: SlipsGroup[], slip: Slip) => {
    const groupTitles = getGroupTitle(slip, groupBy);

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

  if (divideByTitle) {
    return groupedSlips.map((groupedSlip) => {
      const slipsWithTitle: Slip[] = [];
      const slipsWithNoTitle: Slip[] = [];

      groupedSlip.slips.forEach((slip) => {
        if (slip.title) {
          slipsWithTitle.push(slip);
        } else {
          slipsWithNoTitle.push(slip);
        }
      });

      return {
        title: groupedSlip.title,
        slipsWithTitle,
        slipsWithNoTitle,
      };
    });
  }

  return groupedSlips;
}
