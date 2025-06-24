import { useState, useMemo } from "react";
import { PageHeader } from "src/components/layout/PageHeader/PageHeader";
import TableOfContents from "src/components/navigation/TableOfContents/TableOfContents";
import { colours } from "src/constants/colours.constant";
import { groupTasks } from "src/utils/tasks/groupTasks";
import { TasksSection } from "../TasksSection/TasksSection";
import type { Colour } from "src/types/Colour.type";
import type { Task } from "src/types/Task.type";

export type TasksLayoutSection<T> = {
  title: string;
  prefillNewData?: Partial<T>;
  children: React.ReactNode;
};

type TasksLayoutProps = {
  header: React.ReactNode;
  title: string;
  colour?: Colour;
  primaryBadges?: string[];
  secondaryBadges?: string[];
  showNoteCreateTimeOnly?: boolean;
  description?: string;
  tasks: Task[];
};

export const TasksLayout = ({
  header,
  title,
  colour = colours.orange,
  primaryBadges = [],
  secondaryBadges = [],
  description,
  tasks,
}: TasksLayoutProps) => {
  const [navigationId, setNavigationId] = useState("");

  const groupedTasks = groupTasks(tasks, "tag", {});

  const tableOfContentItems = useMemo(() => {
    const noteTOCItems = groupedTasks.map((group) => {
      return {
        title: group.title,
        navigationId: group.title,
      };
    });

    return noteTOCItems;
  }, [groupedTasks]);

  // FIXME: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full max-w-[1000px] w-full min-w-0 pb-16 flex items-center">
      <div className="h-full w-full p-12 flex flex-col gap-14 overflow-y-scroll">
        <PageHeader
          colour={colour}
          primaryBadges={primaryBadges}
          secondaryBadges={secondaryBadges}
          description={description}
        >
          {header}
        </PageHeader>

        {groupedTasks.map((group) => (
          <TasksSection taskGroup={group} colour={colour} />
        ))}
      </div>

      <div className="flex flex-col justify-center">
        <TableOfContents
          title={title}
          items={tableOfContentItems}
          colour={colour}
          activeItemNavigationId={navigationId}
          onJumpTo={(id) => setNavigationId(id)}
        />
      </div>
    </div>
  );
};
