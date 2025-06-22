import type { Tag } from "src/types/Tag.type";
import type { Task, TasksGroup } from "src/types/Task.type";

const getGroup = (
  task: Task,
  groupBy: "created" | "tag"
): {
  title: string;
  relevantTaskData: Partial<Task>;
}[] => {
  switch (groupBy) {
    case "created":
      return [
        {
          title: task.created.format("dddd MMMM D, YYYY"),
          relevantTaskData: {},
        },
      ];
    case "tag": {
      if (task.tags.length === 0) {
        return [
          {
            title: "No Tags",
            relevantTaskData: {
              tags: [],
            },
          },
        ];
      }

      return task.tags.reduce(
        (
          acc: {
            title: string;
            relevantTaskData: Partial<Task>;
          }[],
          tag
        ) => [
          ...acc,
          {
            title: tag.name,
            relevantTaskData: {
              tags: [tag],
            },
          },
        ],
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

export function groupTasks(
  tasks: Task[],
  groupBy: "created" | "tag",
  relevantTaskData: Partial<Task>
): TasksGroup[] {
  const groupedTasks = tasks.reduce((acc: TasksGroup[], task: Task) => {
    const groups = getGroup(task, groupBy);

    for (const group of groups) {
      const existingGroup = acc.find(
        (accGroup) => accGroup.title === group.title
      );

      if (existingGroup) {
        existingGroup.tasks.push(task);
      } else {
        const newGroup: TasksGroup = {
          title: group.title,
          tasks: [task],
          relevantTaskData: {
            tags: mergeTagArrays(
              relevantTaskData?.tags ?? [],
              group.relevantTaskData.tags
            ),
          },
        };

        acc.push(newGroup);
      }
    }

    return acc;
  }, []);

  return groupedTasks;
}
