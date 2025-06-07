import { Check } from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { EditTagModal } from "src/components/EditTagModal/EditTagModal";
import { Icon } from "src/components/Icon/Icon";
import { TaskAndNotesLayout } from "src/components/TaskAndNotesLayout/TaskAndNotesLayout";
import { Toolbar } from "src/components/Toolbar/Toolbar";
import { Button } from "src/components/controls/Button/Button";
import { useGetTag } from "src/hooks/tags/useGetTag";
import { useUpdateTag } from "src/hooks/tags/useUpdateTag";
import { useTaskAndNotesTOCItems } from "src/hooks/useTaskAndNotesTOCItems";
import { cn } from "src/utils/cn";
import isAuthenticated from "src/utils/users/isAuthenticated";

export const Route = createFileRoute("/_layout/tags/$tagId")({
  component: TagComponent,
  // loader: ({ params }) => fetch(params.tagId),
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

export default function TagComponent() {
  const { tagId } = Route.useParams();
  const { tag, tasks, slips } = useGetTag(tagId ?? "");
  const tableOfContentItems = useTaskAndNotesTOCItems(
    tasks,
    slips,
    tag?.groupBy,
    tag?.name
  );
  const { updateTag } = useUpdateTag();

  if (!tag) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Toolbar
        iconName={tag.icon}
        title={tag.name}
        colour={tag.colour}
        titleItems={[
          <div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  colour={tag.colour}
                  iconName="pencil"
                />
              </Dialog.Trigger>

              <EditTagModal tag={tag} />
            </Dialog.Root>
          </div>,
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  colour={tag.colour}
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
                  value={tag.groupBy || "null"}
                  onValueChange={(value) => {
                    if (
                      value === "null" ||
                      value === "created" ||
                      value === "tag"
                    ) {
                      updateTag({
                        tagId: tag.id,
                        updateTagData: {
                          ...tag,
                          groupBy: value === "null" ? null : value,
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
                      `data-[highlighted]:${tag.colour.backgroundPill}`,
                      `data-[highlighted]:${tag.colour.textPill}`
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
                      `data-[highlighted]:${tag.colour.backgroundPill}`,
                      `data-[highlighted]:${tag.colour.textPill}`
                    )}
                    value="created"
                  >
                    Day Created
                    <DropdownMenu.ItemIndicator>
                      <Check />
                    </DropdownMenu.ItemIndicator>
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem
                    className={cn(
                      "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                      `data-[highlighted]:${tag.colour.backgroundPill}`,
                      `data-[highlighted]:${tag.colour.textPill}`
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
                  value={"created"}
                  onValueChange={() => {}}
                >
                  <DropdownMenu.Label className="pl-2 text-xs text-slate-400">
                    Sort by
                  </DropdownMenu.Label>

                  <DropdownMenu.RadioItem
                    className={cn(
                      "leading-none text-sm p-2 flex justify-between items-center outline-none rounded-xl cursor-pointer transition-colors",
                      `data-[highlighted]:${tag.colour.backgroundPill}`,
                      `data-[highlighted]:${tag.colour.textPill}`
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
                      `data-[highlighted]:${tag.colour.backgroundPill}`,
                      `data-[highlighted]:${tag.colour.textPill}`
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

      <TaskAndNotesLayout
        header={
          <div className="flex gap-3">
            <Icon
              className={cn(tag.colour.text)}
              iconName={tag.icon}
              size="xl"
            />

            <h1 className="font-title text-5xl">{tag.name}</h1>
          </div>
        }
        title={tag.name}
        secondaryBadges={[`${0} tasks`, `${slips.length} notes`]}
        colour={tag.colour}
        slips={slips}
        prefillNewNoteData={{ tags: [tag] }}
        tasks={tasks}
        groupSlipsBy={tag.groupBy}
        defaultNoteGroupTitle={tag.name}
        tableOfContentItems={tableOfContentItems}
      />
    </div>
  );
}
