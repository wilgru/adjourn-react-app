import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { ColourPicker } from "src/components/dataEntry/ColourPicker/ColourPicker";
import IconPicker from "src/components/dataEntry/IconPicker/IconPicker";
import { Input } from "src/components/dataEntry/Input/Input";
import { colours } from "src/constants/colours.constant";
import { useUpdateTag } from "src/hooks/tags/useUpdateTag";
import { DeleteTagModal } from "../DeleteTagModal/DeleteTagModal";
import type { Tag } from "src/types/Tag.type";

type EditTagModalProps = {
  tag: Tag;
};

export const EditTagModal = ({ tag }: EditTagModalProps) => {
  const [editedTag, setEditedTag] = useState<Tag>(tag);
  const { updateTag } = useUpdateTag();

  // TODO: find better solution than using useEffect
  useEffect(() => {
    setEditedTag(tag);
  }, [tag]);

  const onSaveEdit = async () => {
    if (tag?.id) {
      await updateTag({
        tagId: editedTag.id,
        updateTagData: editedTag,
      });
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black opacity-25 fixed inset-0" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none bg-white border border-slate-300 rounded-2xl shadow-2xl">
        <Dialog.Title className="mb-5">Edit tag</Dialog.Title>

        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-sm">Name</h3>
            <Input
              size="md"
              id={tag.id}
              value={editedTag.name}
              onChange={(e) =>
                setEditedTag((currentTagToEdit) => {
                  return { ...currentTagToEdit, name: e.target.value };
                })
              }
            />
          </div>

          <div>
            <h3 className="text-sm">Description (optional)</h3>
            <textarea
              name="description"
              value={editedTag.description ?? undefined}
              placeholder="No description"
              onChange={(e) =>
                setEditedTag((currentTagToEdit) => {
                  return { ...currentTagToEdit, description: e.target.value };
                })
              }
              className="block p-1 text-sm w-full bg-white rounded-md border border-slate-300 placeholder:text-slate-500"
            />
          </div>

          <div>
            <h3 className="text-sm">Colour</h3>
            <ColourPicker
              selectedColourName={editedTag.colour.name}
              onSelectColour={(colour) => {
                setEditedTag((currentTagToEdit) => {
                  return { ...currentTagToEdit, colour: colour };
                });
              }}
            />
          </div>

          <div>
            <h3 className="text-sm">Icon</h3>
            <IconPicker
              selectedIconName={editedTag.icon}
              colour={editedTag.colour}
              onSelectIcon={(iconName) => {
                setEditedTag((currentTagToEdit) => {
                  return { ...currentTagToEdit, icon: iconName };
                });
              }}
            />
          </div>

          <div className="flex justify-between">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button colour={colours.red} variant="block" size="sm">
                  Delete
                </Button>
              </Dialog.Trigger>

              <DeleteTagModal tag={tag} />
            </Dialog.Root>

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
