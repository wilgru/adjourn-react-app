import * as Dialog from "@radix-ui/react-dialog";
import { useState, useRef } from "react";
import { PageHeader } from "src/components/PageHeader/PageHeader";
import { SlipCard } from "src/components/SlipCard/SlipCard";
import TableOfContents from "src/components/TableOfContents/TableOfContents";
import { colours } from "src/constants/colours.constant";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import { groupSlips } from "src/utils/slips/groupSlips";
import EditSlipModal from "../EditSlipModal/EditSlipModal";
import { Button } from "../controls/Button/Button";
import { TaskItem } from "../dataDisplay/TaskItem/TaskItem";
import type { TableOfContentsItem } from "src/components/TableOfContents/TableOfContents";
import type { Colour } from "src/types/Colour.type";
import type { Slip, SlipsGroup } from "src/types/Slip.type";
import type { Task } from "src/types/Task.type";

type TaskAndNotesLayoutProps = {
  header: React.ReactNode;
  title: string;
  colour?: Colour;
  primaryBadges?: string[];
  secondaryBadges?: string[];
  tasks: Task[];
  slips: Slip[];
  prefillNewNoteData?: Partial<Slip>;
  groupSlipsBy?: "created" | "tag" | null;
  defaultNoteGroupTitle?: string;
  tableOfContentItems: TableOfContentsItem[];
};

export const TaskAndNotesLayout = ({
  header,
  title,
  colour = colours.orange,
  primaryBadges = [],
  secondaryBadges = [],
  tasks,
  slips,
  prefillNewNoteData,
  groupSlipsBy = null,
  defaultNoteGroupTitle,
  tableOfContentItems,
}: TaskAndNotesLayoutProps) => {
  const slipRefs = useRef<HTMLDivElement[]>([]);
  const [navigationId, setNavigationId] = useState("");
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);

  useIntersectionObserver(
    slipRefs,
    (entry) => {
      setNavigationId(entry.target.id);
    },
    { rootMargin: "-10% 0% -90% 0%" },
    { disabled: false }
  );

  const slipGroups: SlipsGroup[] = !groupSlipsBy
    ? [
        {
          title: "Notes",
          slips: slips,
          relevantNoteData: prefillNewNoteData ?? {},
        },
      ]
    : groupSlips(
        slips,
        groupSlipsBy,
        groupSlipsBy === "tag" ? defaultNoteGroupTitle : undefined,
        prefillNewNoteData ?? {}
      );

  // TODO: pb-16 is the height of the toolbar to fix issue with scrolling body getting cut off. Issue to do with not having a fixed height on consuming element and children elements before this one pushing this one down.
  return (
    <div className="h-full max-w-[1000px] w-full min-w-0 pb-16 flex items-center">
      <div className="h-full w-full p-12 flex flex-col gap-8 overflow-y-scroll">
        <PageHeader
          colour={colour}
          primaryBadges={primaryBadges}
          secondaryBadges={secondaryBadges}
        >
          {header}
        </PageHeader>

        <section>
          <div className="flex gap-2 p-2">
            <h2 className="text-slate-400 font-title text-2xl">Tasks</h2>

            <div className="mb-2">
              <Button
                variant="ghost"
                className="w-full"
                iconName="plus"
                size="sm"
                onClick={() => {}}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-1">
            {tasks.length === 0 && (
              <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
                <p className="text-slate-500">No tasks yet</p>

                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    iconName="plusSquare"
                    onClick={() => {}}
                  >
                    Create your first task
                  </Button>
                </div>
              </div>
            )}

            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} colour={colour} />
            ))}
          </div>
        </section>

        {slipGroups.map((slipGroup) => (
          <section>
            <Dialog.Root>
              <div className="flex gap-2 p-2">
                <h2 className="text-slate-400 font-title text-2xl">
                  {slipGroup.title}
                </h2>

                <Dialog.Trigger asChild>
                  <div className="mb-2">
                    <Button
                      variant="ghost"
                      className="w-full"
                      iconName="plus"
                      size="sm"
                      onClick={() => setShowEditNoteModal(true)}
                    />
                  </div>
                </Dialog.Trigger>
              </div>

              {slipGroup.slips.length === 0 && (
                <div className="w-full p-3 flex flex-col gap-3 items-center rounded-lg bg-gray-50">
                  <p className="text-slate-500">No notes yet</p>

                  <Dialog.Trigger asChild>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        iconName="plusSquare"
                        onClick={() => setShowEditNoteModal(true)}
                      >
                        Create your first note
                      </Button>
                    </div>
                  </Dialog.Trigger>
                </div>
              )}

              <div className="flex flex-col gap-5">
                {slipGroup.slips.map((slip) => (
                  <SlipCard
                    ref={(el: HTMLDivElement | null) => {
                      if (el && !slipRefs.current.includes(el)) {
                        slipRefs.current.push(el);
                      }
                    }}
                    colour={colour}
                    slip={slip}
                  />
                ))}
              </div>

              {showEditNoteModal && (
                <EditSlipModal
                  slip={slipGroup.relevantNoteData}
                  onSave={() => {
                    setShowEditNoteModal(false);
                  }}
                />
              )}
            </Dialog.Root>
          </section>
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
