import type { Slip, SlipsGroup } from "src/types/Slip.type";
import type { Tag } from "src/types/Tag.type";

const getGroup = (
  slip: Slip,
  groupBy: "created" | "tag",
  defaultGroupTitle: string | undefined = undefined
): {
  title: string;
  relevantNoteData: Partial<Slip>;
}[] => {
  switch (groupBy) {
    case "created":
      return [
        {
          title: slip.created.format("ddd D MMMM YYYY"),
          relevantNoteData: {},
        },
      ];
    case "tag": {
      if (
        slip.tags.length === 1 &&
        slip.tags.at(0)?.name === defaultGroupTitle
      ) {
        const defaultTag = slip.tags.find(
          (tag) => tag.name === defaultGroupTitle
        );

        return [
          {
            title: "Notes",
            relevantNoteData: {
              tags: defaultTag ? [defaultTag] : [],
            },
          },
        ];
      }

      return slip.tags.reduce(
        (
          acc: {
            title: string;
            relevantNoteData: Partial<Slip>;
          }[],
          tag
        ) => {
          if (tag.name === defaultGroupTitle) {
            return acc;
          }

          return [
            ...acc,
            {
              title: tag.name,
              relevantNoteData: {
                tags: [tag],
              },
            },
          ];
        },
        []
      );
    }

    default:
      return [];
  }
};

const mergeTagArrays = (tagsArray1: Tag[] = [], tagsArray2: Tag[] = []) => {
  const map = new Map();

  [...tagsArray1, ...tagsArray2].forEach((tag: Tag) => {
    map.set(tag.id, tag);
  });

  return Array.from(map.values());
};

export function groupSlips(
  slips: Slip[],
  groupBy: "created" | "tag",
  defaultGroupTitle: string | undefined = undefined,
  relevantNoteData: Partial<Slip>
): SlipsGroup[] {
  const groupedSlips = slips.reduce((acc: SlipsGroup[], slip: Slip) => {
    const groups = getGroup(slip, groupBy, defaultGroupTitle);

    for (const group of groups) {
      const existingGroup = acc.find(
        (accGroup) => accGroup.title === group.title
      );

      if (existingGroup) {
        existingGroup.slips.push(slip);
      } else {
        const newGroup: SlipsGroup = {
          title: group.title,
          slips: [slip],
          relevantNoteData: {
            tags: mergeTagArrays(
              relevantNoteData?.tags ?? [],
              group.relevantNoteData.tags
            ),
          },
        };

        acc.push(newGroup);
      }
    }

    return acc;
  }, []);

  return groupedSlips;
}
