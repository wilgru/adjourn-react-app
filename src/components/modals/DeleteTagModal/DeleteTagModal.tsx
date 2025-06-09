import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "src/components/controls/Button/Button";
import { colours } from "src/constants/colours.constant";
import { useDeleteTag } from "src/hooks/tags/useDeleteTag";
import type { Tag } from "src/types/Tag.type";

type DeleteTagModalProps = {
  tag: Tag;
};

export const DeleteTagModal = ({ tag }: DeleteTagModalProps) => {
  const { deleteTag } = useDeleteTag();

  const onConfirmDelete = async () => {
    if (tag) {
      await deleteTag(tag.id);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black opacity-25 fixed inset-0" />
      <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none bg-white border border-slate-300 rounded-2xl shadow-2xl">
        <Dialog.Title className="mb-5">Confirm delete tag</Dialog.Title>
        <Dialog.Description className="mb-5">
          <p className="text-sm">
            Are you sure you want to delete '{tag?.name}'?
          </p>
        </Dialog.Description>

        <div className="flex gap-2 justify-end">
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <Button colour={colours.red} onClick={onConfirmDelete}>
              Confirm
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};
