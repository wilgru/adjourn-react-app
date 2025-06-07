import type { Note, NotesGroup } from "src/types/Note.type";
import type { Tag } from "src/types/Tag.type";

const getGroup = (
  note: Note,
  groupBy: "created" | "tag",
  defaultGroupTitle: string | undefined = undefined
): {
  title: string;
  relevantNoteData: Partial<Note>;
}[] => {
  switch (groupBy) {
    case "created":
      return [
        {
          title: note.created.format("ddd D MMMM YYYY"),
          relevantNoteData: {},
        },
      ];
    case "tag": {
      if (
        note.tags.length === 1 &&
        note.tags.at(0)?.name === defaultGroupTitle
      ) {
        const defaultTag = note.tags.find(
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

      return note.tags.reduce(
        (
          acc: {
            title: string;
            relevantNoteData: Partial<Note>;
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

export function groupNotes(
  notes: Note[],
  groupBy: "created" | "tag",
  defaultGroupTitle: string | undefined = undefined,
  relevantNoteData: Partial<Note>
): NotesGroup[] {
  const groupedNotes = notes.reduce((acc: NotesGroup[], note: Note) => {
    const groups = getGroup(note, groupBy, defaultGroupTitle);

    for (const group of groups) {
      const existingGroup = acc.find(
        (accGroup) => accGroup.title === group.title
      );

      if (existingGroup) {
        existingGroup.notes.push(note);
      } else {
        const newGroup: NotesGroup = {
          title: group.title,
          notes: [note],
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

  return groupedNotes;
}
