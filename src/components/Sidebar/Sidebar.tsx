import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import EditSlipModal from "src/components/EditSlipModal/EditSlipModal";
import { Button } from "src/components/controls/Button/Button";
import { colours } from "src/constants/colours.constant";
import { useGetJournals } from "src/hooks/journals/useGetJournals";
import { cn } from "src/utils/cn";
import { NavItem } from "../NavItem/NavItem";

export const Sidebar = () => {
  const { journals } = useGetJournals();

  const [showEditSlipModal, setShowEditSlipModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const onClickShowSidebarToggle = (): void => {
    setExpanded((currentShowSidebar) => !currentShowSidebar);
  };

  return (
    <aside className={cn("p-3 bg-slate-50", expanded && "min-w-60")}>
      <div
        className={cn(
          "flex flex-col flex-shrink-0 justify-between gap-3 h-full"
        )}
      >
        <div className="flex flex-col gap-3 justify-between overflow-y-auto">
          <div
            className={cn(
              "flex items-center gap-2 justify-between",
              expanded ? "flex-row" : "flex-col-reverse"
            )}
          >
            <Button
              variant="ghost"
              onClick={onClickShowSidebarToggle}
              iconName={expanded ? "caretLeft" : "caretRight"}
            />
          </div>

          <section className="flex flex-col gap-1">
            <NavItem
              ghost
              iconName="calendarDot"
              title="Today"
              to="/stream/"
              expanded={expanded}
            />

            <NavItem
              ghost
              iconName="flag"
              title={"Flagged"}
              to={`/flagged/`}
              expanded={expanded}
            />
          </section>

          <section className={cn("flex flex-col gap-1", expanded && "p-1")}>
            {expanded && (
              <h1 className="font-title text-slate-400 text-md ml-2">Tags</h1>
            )}

            {journals.map((journal) => (
              <NavItem
                iconName={journal.icon}
                colour={journal.colour}
                title={journal.name}
                preview={journal.slipCount}
                to={`/journals/${journal.id}`}
                expanded={expanded}
              />
            ))}
          </section>
        </div>

        <div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                iconName="pencil"
                colour={colours.orange}
                onClick={() => {
                  setShowEditSlipModal(true);
                }}
              >
                {expanded ? "New Slip" : undefined}
              </Button>
            </Dialog.Trigger>
            {showEditSlipModal && (
              <EditSlipModal
                onSave={() => {
                  setShowEditSlipModal(false);
                }}
              />
            )}
          </Dialog.Root>
        </div>
      </div>
    </aside>
  );
};
