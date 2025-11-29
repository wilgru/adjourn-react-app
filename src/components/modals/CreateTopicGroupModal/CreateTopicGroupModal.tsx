import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { Input } from "src/components/dataEntry/Input/Input";
import { Label } from "src/components/general/Label/Label";
import { colours } from "src/constants/colours.constant";
import { useCreateTopicGroup } from "src/hooks/tags/useCreateTopicGroup";
import type { TopicGroup } from "src/types/Tag.type";

type newTopicGroup = Omit<
  TopicGroup,
  "id" | "topics" | "groupBy" | "created" | "updated"
>;

export const CreateTopicGroupModal = () => {
  const [newTopicGroupToEdit, setNewTopicGroupToEdit] = useState<newTopicGroup>(
    { title: "" }
  );
  const { createTopicGroup } = useCreateTopicGroup();

  const onSaveEdit = async () => {
    createTopicGroup({
      createTopicGroupData: {
        ...newTopicGroupToEdit,
      },
    });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black opacity-25 fixed inset-0 data-[state=open]:animate-overlayShow" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll p-4 focus:outline-none bg-white border border-slate-300 rounded-2xl shadow-2xl  data-[state=open]:animate-contentShow">
        <Dialog.Title className="mb-5">Create Topic Group</Dialog.Title>

        <div className="flex flex-col gap-3">
          <div>
            <Label title="Title" />
            <Input
              size="md"
              value={newTopicGroupToEdit.title}
              onChange={(e) =>
                setNewTopicGroupToEdit((currentNewTopicGroupToEdit) => {
                  return {
                    ...currentNewTopicGroupToEdit,
                    title: e.target.value,
                  };
                })
              }
            />
          </div>

          <div className="flex justify-end w-full">
            <div className="flex gap-2 justify-end">
              <Dialog.Close asChild>
                <Button aria-label="Close" size="sm" variant="ghost">
                  Discard
                </Button>
              </Dialog.Close>

              <Dialog.Close asChild>
                <Button
                  aria-label="Confirm"
                  colour={colours.green}
                  size="sm"
                  onClick={onSaveEdit}
                >
                  Save
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
