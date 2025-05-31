import { Check } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { EditJournalModal } from "src/components/EditJournalModal/EditJournalModal";
import { JournalHeader } from "src/components/JournalHeader/JournalHeader";
import { SlipCard } from "src/components/SlipCard/SlipCard";
import TableOfContents from "src/components/TableOfContents/TableOfContents";
import { Button } from "src/components/controls/Button/Button";
import { Toolbar } from "src/components/toolbar/Toolbar";
import { useGetJournal } from "src/hooks/journals/useGetJournal";
import { useUpdateJournal } from "src/hooks/journals/useUpdateJournal";
import { useIntersectionObserver } from "src/hooks/useIntersectionObserver";
import { cn } from "src/utils/cn";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/journals/$journalId")({
  component: JournalComponent,
  // loader: ({ params }) => fetchJournal(params.journalId),
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

export default function JournalComponent() {
  const { journalId } = Route.useParams();
  const { journal, slipGroups, tableOfContentItems } = useGetJournal(
    journalId ?? ""
  );
  const { updateJournal } = useUpdateJournal();
  const [navigationId, setNavigationId] = useState("");

  const slipRefs = useRef<HTMLDivElement[]>([]);

  useIntersectionObserver(
    slipRefs,
    (entry) => {
      setNavigationId(entry.target.id);
    },
    { rootMargin: "-10% 0% -90% 0%" },
    { disabled: false }
  );

  useEffect(() => {
    const firstNavigationId =
      slipGroups.at(0)?.slipsWithNoTitle.at(0)?.id ??
      slipGroups.at(0)?.slipsWithTitle.at(0)?.id;

    firstNavigationId && setNavigationId(firstNavigationId);
  }, [slipGroups]);

  if (!journal) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col justify-center">
      <Toolbar
        title={journal.name}
        titleItems={[
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                colour={journal.colour}
                iconName="palette"
              />
            </Dialog.Trigger>

            <EditJournalModal journal={journal} />
          </Dialog.Root>,
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  colour={journal.colour}
                  iconName="arrowsDownUp"
                />
              </div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="flex flex-col gap-2 bg-white border border-slate-200 rounded-2xl p-2 w-40 drop-shadow"
                sideOffset={2}
                align="start"
              >
                <DropdownMenu.RadioGroup
                  value={journal.groupBy}
                  onValueChange={(value) => {
                    if (value === "created" || value === "journal") {
                      updateJournal({
                        journalId: journal.id,
                        updateJournalData: {
                          ...journal,
                          groupBy: value,
                        },
                      });
                    }
                  }}
                >
                  <DropdownMenu.Label className="pl-2 text-xs text-slate-400">
                    Group by
                  </DropdownMenu.Label>

                  <DropdownMenu.RadioItem
                    className={cn(
                      "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                      `data-[highlighted]:${journal.colour.backgroundPill}`,
                      `data-[highlighted]:${journal.colour.textPill}`
                    )}
                    value="created"
                  >
                    Created
                    <DropdownMenu.ItemIndicator>
                      <Check />
                    </DropdownMenu.ItemIndicator>
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem
                    className={cn(
                      "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                      `data-[highlighted]:${journal.colour.backgroundPill}`,
                      `data-[highlighted]:${journal.colour.textPill}`
                    )}
                    value="journal"
                  >
                    Journal
                    <DropdownMenu.ItemIndicator>
                      <Check />
                    </DropdownMenu.ItemIndicator>
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>

                <DropdownMenu.RadioGroup
                  value={"created"}
                  onValueChange={() => {}}
                >
                  <DropdownMenu.Label className="pl-2 text-xs text-slate-400">
                    Sort by
                  </DropdownMenu.Label>

                  <DropdownMenu.RadioItem
                    className={cn(
                      "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                      `data-[highlighted]:${journal.colour.backgroundPill}`,
                      `data-[highlighted]:${journal.colour.textPill}`
                    )}
                    value="created"
                  >
                    Created
                    <DropdownMenu.ItemIndicator>
                      <Check />
                    </DropdownMenu.ItemIndicator>
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem
                    className={cn(
                      "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                      `data-[highlighted]:${journal.colour.backgroundPill}`,
                      `data-[highlighted]:${journal.colour.textPill}`
                    )}
                    value="title"
                  >
                    Title
                    <DropdownMenu.ItemIndicator>
                      <Check />
                    </DropdownMenu.ItemIndicator>
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>,
        ]}
      />

      <div className="max-w-[800px] p-8 flex flex-col gap-8 overflow-y-scroll">
        <JournalHeader journal={journal} slipGroups={slipGroups} />

        {slipGroups.map((slipGroup) => (
          <div className="flex flex-col">
            <h2 className="pl-2 text-slate-400 font-title font-thin text-xl">
              {slipGroup.title}
            </h2>

            <div className="flex flex-col gap-3">
              {slipGroup.slipsWithNoTitle.map((slip) => (
                <SlipCard
                  ref={(el: HTMLDivElement | null) => {
                    if (el && !slipRefs.current.includes(el)) {
                      slipRefs.current.push(el);
                    }
                  }}
                  slip={slip}
                  colour={journal.colour}
                />
              ))}

              {slipGroup.slipsWithNoTitle.length > 0 &&
                slipGroup.slipsWithTitle.length > 0 && (
                  <div className="flex flex-row gap-2 justify-center">
                    <div className=" rounded-full bg-slate-300 h-1 w-1"></div>
                    <div className=" rounded-full bg-slate-300 h-1 w-1"></div>
                    <div className=" rounded-full bg-slate-300 h-1 w-1"></div>
                  </div>
                )}

              {slipGroup.slipsWithTitle.map((slip) => (
                <SlipCard
                  ref={(el: HTMLDivElement | null) => {
                    if (el && !slipRefs.current.includes(el)) {
                      slipRefs.current.push(el);
                    }
                  }}
                  slip={slip}
                  colour={journal.colour}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* <TableOfContents
        items={tableOfContentItems}
        activeItemNavigationId={navigationId}
        onJumpTo={(id) => setNavigationId(id)}
        colour={journal.colour}
      /> */}
    </div>
  );
}
