import { useState, useRef, useEffect } from "react";
import { PageHeader } from "src/components/PageHeader/PageHeader";
import { SlipCard } from "src/components/SlipCard/SlipCard";
import TableOfContents from "src/components/TableOfContents/TableOfContents";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import type { TableOfContentsItem } from "src/components/TableOfContents/TableOfContents";
import type { Slip } from "src/types/Slip.type";

type TaskAndNotesLayoutProps = {
  header: React.ReactNode;
  primaryBadges?: string[];
  secondaryBadges?: string[];
  slips: Slip[];
  tableOfContentItems: TableOfContentsItem[];
};

export const TaskAndNotesLayout = ({
  header,
  primaryBadges = [],
  secondaryBadges = [],
  slips,
  tableOfContentItems,
}: TaskAndNotesLayoutProps) => {
  const slipRefs = useRef<HTMLDivElement[]>([]);
  const [navigationId, setNavigationId] = useState("");

  useIntersectionObserver(
    slipRefs,
    (entry) => {
      setNavigationId(entry.target.id);
    },
    { rootMargin: "-10% 0% -90% 0%" },
    { disabled: false }
  );

  useEffect(() => {
    const lastSlip = slips.at(slips.length - 1);

    lastSlip?.title && setNavigationId(lastSlip.title);
  }, [slips]);

  // TODO: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full pb-16 flex items-center">
      <div className="h-full max-w-[800px] p-12 flex flex-col gap-8 overflow-y-scroll">
        <PageHeader
          primaryBadges={primaryBadges}
          secondaryBadges={secondaryBadges}
        >
          {header}
        </PageHeader>

        <section>
          <h2 className="text-slate-400 font-title text-2xl p-2">Tasks</h2>
        </section>

        <section>
          <h2 className="text-slate-400 font-title text-2xl p-2">Notes</h2>

          <div className="flex flex-col gap-4">
            {slips.map((slip) => (
              <SlipCard
                ref={(el: HTMLDivElement | null) => {
                  if (el && !slipRefs.current.includes(el)) {
                    slipRefs.current.push(el);
                  }
                }}
                slip={slip}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-col justify-center">
        <TableOfContents
          items={tableOfContentItems}
          activeItemNavigationId={navigationId}
          onJumpTo={(id) => setNavigationId(id)}
        />
      </div>
    </div>
  );
};
