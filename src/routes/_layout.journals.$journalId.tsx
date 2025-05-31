import { Check } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useRef } from "react";
import { EditJournalModal } from "src/components/EditJournalModal/EditJournalModal";
import { JournalHeader } from "src/components/JournalHeader/JournalHeader";
import { SlipCard } from "src/components/SlipCard/SlipCard";
import { Toolbar } from "src/components/Toolbar/Toolbar";
import { Button } from "src/components/controls/Button/Button";
import { useGetJournal } from "src/hooks/journals/useGetJournal";
import { useUpdateJournal } from "src/hooks/journals/useUpdateJournal";
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
  const { journal, slips } = useGetJournal(journalId ?? "");
  const { updateJournal } = useUpdateJournal();

  const slipRefs = useRef<HTMLDivElement[]>([]);

  if (!journal) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName={journal.icon}
        title={journal.name}
        colour={journal.colour}
        titleItems={[
          <div>
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
            </Dialog.Root>
          </div>,
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

      <div className="max-w-[800px] p-12 flex flex-col gap-8 overflow-y-scroll">
        <JournalHeader journal={journal} slips={slips} />

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
                colour={journal.colour}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
