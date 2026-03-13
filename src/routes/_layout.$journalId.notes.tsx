import { Check } from "@phosphor-icons/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo } from "react";
import isAuthenticated from "src/Users/utils/isAuthenticated";
import { colours } from "src/colours/colours.constant";
import { Button } from "src/common/components/Button/Button";
import { Toolbar } from "src/common/components/Toolbar/Toolbar";
import { cn } from "src/common/utils/cn";
import { sortNotes } from "src/common/utils/sortNotes";
import { useGetJournals } from "src/journals/hooks/useGetJournals";
import { useUpdateJournal } from "src/journals/hooks/useUpdateJournal";
import { NotesLayout } from "src/notes/components/NotesLayout/NotesLayout";
import { useGetNote } from "src/notes/hooks/useGetNote";
import { useGetNotes } from "src/notes/hooks/useGetNotes";

export const Route = createFileRoute("/_layout/$journalId/notes")({
  component: NotesComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
        search: {
          // (Do not use `router.state.resolvedLocation` as it can potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
  validateSearch: (
    search: Record<string, unknown>,
  ): { noteId: string | null } => {
    return {
      noteId: typeof search.noteId === "string" ? search.noteId : null,
    };
  },
});

function NotesComponent() {
  const { journalId } = Route.useParams();
  const { notes } = useGetNotes({
    createdDateString: undefined,
    isBookmarked: undefined,
  });
  const { noteId } = Route.useSearch(); // TODO: use in loaders?
  const { note } = useGetNote({ noteId });
  const { journals } = useGetJournals();
  const { updateJournal } = useUpdateJournal();

  const journal = journals.find((j) => j.id === journalId);

  const sortBy = journal?.notesSortBy ?? "created";
  const sortDirection = journal?.notesSortDirection ?? "asc";
  const groupBy = journal?.notesGroupBy ?? null;

  const sortedNotes = useMemo(
    () => sortNotes(notes, sortBy, sortDirection),
    [notes, sortBy, sortDirection],
  );

  if (!journal) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar iconName="pencil" title={"Notes"} colour={colours.grey}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div>
              <Button
                variant="ghost"
                size="sm"
                colour={colours.grey}
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
                value={groupBy || "null"}
                onValueChange={(value) => {
                  if (
                    value === "null" ||
                    value === "created" ||
                    value === "tag"
                  ) {
                    updateJournal({
                      journalId: journal.id,
                      updateJournalData: {
                        ...journal,
                        notesGroupBy: value === "null" ? null : value,
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
                    `data-[highlighted]:${colours.grey.backgroundPill}`,
                    `data-[highlighted]:${colours.grey.textPill}`,
                  )}
                  value="null"
                >
                  None
                  <DropdownMenu.ItemIndicator>
                    <Check />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>

                <DropdownMenu.RadioItem
                  className={cn(
                    "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                    `data-[highlighted]:${colours.grey.backgroundPill}`,
                    `data-[highlighted]:${colours.grey.textPill}`,
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
                    `data-[highlighted]:${colours.grey.backgroundPill}`,
                    `data-[highlighted]:${colours.grey.textPill}`,
                  )}
                  value="tag"
                >
                  Tag
                  <DropdownMenu.ItemIndicator>
                    <Check />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>

              <DropdownMenu.RadioGroup
                value={sortBy}
                onValueChange={(value) => {
                  if (value === "created" || value === "alphabetical") {
                    updateJournal({
                      journalId: journal.id,
                      updateJournalData: {
                        ...journal,
                        notesSortBy: value,
                      },
                    });
                  }
                }}
              >
                <DropdownMenu.Label className="pl-2 text-xs text-slate-400">
                  Sort by
                </DropdownMenu.Label>

                <DropdownMenu.RadioItem
                  className={cn(
                    "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                    `data-[highlighted]:${colours.grey.backgroundPill}`,
                    `data-[highlighted]:${colours.grey.textPill}`,
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
                    `data-[highlighted]:${colours.grey.backgroundPill}`,
                    `data-[highlighted]:${colours.grey.textPill}`,
                  )}
                  value="alphabetical"
                >
                  Alphabetical
                  <DropdownMenu.ItemIndicator>
                    <Check />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>

              <DropdownMenu.RadioGroup
                value={sortDirection}
                onValueChange={(value) => {
                  if (value === "asc" || value === "desc") {
                    updateJournal({
                      journalId: journal.id,
                      updateJournalData: {
                        ...journal,
                        notesSortDirection: value,
                      },
                    });
                  }
                }}
              >
                <DropdownMenu.Label className="pl-2 text-xs text-slate-400">
                  Sort direction
                </DropdownMenu.Label>

                <DropdownMenu.RadioItem
                  className={cn(
                    "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                    `data-[highlighted]:${colours.grey.backgroundPill}`,
                    `data-[highlighted]:${colours.grey.textPill}`,
                  )}
                  value="asc"
                >
                  Ascending
                  <DropdownMenu.ItemIndicator>
                    <Check />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem
                  className={cn(
                    "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                    `data-[highlighted]:${colours.grey.backgroundPill}`,
                    `data-[highlighted]:${colours.grey.textPill}`,
                  )}
                  value="desc"
                >
                  Descending
                  <DropdownMenu.ItemIndicator>
                    <Check />
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </Toolbar>

      <NotesLayout
        title={"Notes"}
        notes={sortedNotes}
        colour={colours.grey}
        selectedNote={note || null}
        description={null}
        groupNotesBy={groupBy ?? undefined}
        groupSortDirection={sortDirection}
      />
    </div>
  );
}
