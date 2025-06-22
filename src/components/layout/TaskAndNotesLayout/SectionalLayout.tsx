import { useState, useMemo } from "react";
import { PageHeader } from "src/components/layout/PageHeader/PageHeader";
import TableOfContents from "src/components/navigation/TableOfContents/TableOfContents";
import { colours } from "src/constants/colours.constant";
import type { Colour } from "src/types/Colour.type";
import type { Note } from "src/types/Note.type";
import type { Task } from "src/types/Task.type";

export type SectionalLayoutSection<T> = {
  title: string;
  prefillNewData?: Partial<T>;
  children: React.ReactNode;
};

type SectionalLayoutProps = {
  header: React.ReactNode;
  title: string;
  colour?: Colour;
  primaryBadges?: string[];
  secondaryBadges?: string[];
  showNoteCreateTimeOnly?: boolean;
  description?: string;
  sections: SectionalLayoutSection<Note | Task>[];
};

export const SectionalLayout = ({
  header,
  title,
  colour = colours.orange,
  primaryBadges = [],
  secondaryBadges = [],
  description,
  sections,
}: SectionalLayoutProps) => {
  const [navigationId, setNavigationId] = useState("");

  const tableOfContentItems = useMemo(() => {
    const noteTOCItems = sections.map((section) => {
      return {
        title: section.title,
        navigationId: section.title,
      };
    });

    return noteTOCItems;
  }, [sections]);

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

        {sections.map((section) => (
          <div className="flex flex-col gap-2">
            <h2 className="font-title text-4xl p-2">{section.title}</h2>

            {section.children}
          </div>
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
