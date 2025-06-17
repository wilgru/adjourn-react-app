import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
} from "@phosphor-icons/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import dayjs from "dayjs";
import Delta from "quill-delta";
import { useMemo, useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { Toggle } from "src/components/controls/Toggle/Toggle";
import { QuillEditor } from "src/components/dataEntry/QuillEditor/QuillEditor";
import { colours } from "src/constants/colours.constant";
import { useCreateNote } from "src/hooks/notes/useCreateNote";
import { useDeleteNote } from "src/hooks/notes/useDeleteNote";
import { useUpdateNote } from "src/hooks/notes/useUpdateNote";
import { isNoteContentEmpty } from "src/utils/notes/isNoteContentEmpty";
import { TagMultiSelect } from "../../dataEntry/TagMultiSelect/TagMultiSelect";
import type { StringMap } from "quill";
import type { Note } from "src/types/Note.type";

type EditNoteModalProps = {
  note?: Partial<Note>;
  onSave?: () => void;
};

//TODO: move to types folder
// AnyKeyValueOf
export type AnyKeyValueOfNote = {
  [K in keyof Note]: { [P in K]: Note[K] };
}[keyof Note];

const QUILL_TOOLBAR_ID = "toolbar";

const getInitialNote = (note: Partial<Note> | undefined): Note => {
  return {
    id: note?.id || "",
    title: note?.title || "",
    content: note?.content || new Delta(),
    tags: note?.tags || [],
    isFlagged: note?.isFlagged || false,
    isPinned: note?.isPinned || false,
    created: note?.created || dayjs(),
    updated: note?.updated || dayjs(),
    deleted: note?.deleted || null,
    isDraft: false,
  };
};

const EditNoteModal = ({ note, onSave }: EditNoteModalProps) => {
  const { createNote } = useCreateNote();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();

  const [editedNote, setEditedNote] = useState<Note>(getInitialNote(note));
  const [toolbarFormatting, setToolbarFormatting] = useState<StringMap>();
  const [updatedDateVisible, setUpdatedDateVisible] = useState<boolean>();

  const initialNote = useMemo(() => getInitialNote(note), [note]);

  const onSaveNote = async () => {
    if (!editedNote.title && isNoteContentEmpty(editedNote.content)) {
      return;
    }

    if (editedNote.id) {
      await updateNote({
        noteId: initialNote.id,
        updateNoteData: editedNote,
      });
    } else {
      createNote({ createNoteData: editedNote });
    }

    onSave?.();
  };

  const onDeleteNote = async () => {
    deleteNote({ noteId: initialNote.id });
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-25" />
      <Dialog.Content
        onInteractOutside={onSaveNote}
        onEscapeKeyDown={onSaveNote}
        onFocusOutside={onSaveNote}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] w-3/4 max-w-[800px] bg-white flex flex-col gap-3 p-3 border border-slate-300 rounded-2xl shadow-2xl"
      >
        <div className="flex flex-col gap-1">
          <textarea
            name="content"
            value={editedNote.title ?? ""}
            placeholder="No Title"
            onChange={(e) =>
              setEditedNote((currentEditedNote) => {
                const newNoteData = {
                  ...currentEditedNote,
                  title: e.target.value,
                };

                return newNoteData;
              })
            }
            className="h-10 w-full text-2xl font-normal tracking-tight overflow-y-hidden bg-white placeholder-slate-400 select-none resize-none outline-none"
          />

          <div className="flex flex-row justify-between w-full">
            <div className="-ml-2" id={QUILL_TOOLBAR_ID}>
              <ToggleGroup.Root
                className="font-medium text-sm"
                type="multiple"
                defaultValue={[]}
                value={[
                  ...(toolbarFormatting?.bold ? ["bold"] : []),
                  ...(toolbarFormatting?.italic ? ["italic"] : []),
                  ...(toolbarFormatting?.underline ? ["underline"] : []),
                  ...(toolbarFormatting?.strike ? ["strike"] : []),
                ]}
                aria-label="Text alignment"
              >
                <span className="ql-formats flex flex-row gap-1">
                  <ToggleGroup.Item
                    className="ql-bold rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
                    value="bold"
                  >
                    <TextB size={16} weight="bold" />
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    className="ql-italic rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
                    value="italic"
                  >
                    <TextItalic size={16} weight="bold" />
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    className="ql-underline rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
                    value="underline"
                  >
                    <TextUnderline size={16} weight="bold" />
                  </ToggleGroup.Item>
                  <ToggleGroup.Item
                    className=" ql-strike rounded-md text-slate-500 data-[state=off]:hover:bg-orange-100 data-[state=off]:hover:text-orange-500 data-[state=on]:bg-orange-100 data-[state=on]:text-orange-500 px-2 py-1"
                    value="strike"
                  >
                    <TextStrikethrough size={16} weight="bold" />
                  </ToggleGroup.Item>
                </span>
              </ToggleGroup.Root>
            </div>

            <div className="flex gap-2">
              <Button
                colour={colours.blue}
                variant="ghost"
                size="sm"
                iconName="paperclip"
              />
            </div>
          </div>
        </div>

        <QuillEditor
          toolbarId={QUILL_TOOLBAR_ID}
          initialValue={initialNote.content}
          onChange={(delta) =>
            setEditedNote((currentEditedNote) => {
              const newNoteData = {
                ...currentEditedNote,
                content: delta,
              };

              return newNoteData;
            })
          }
          onSelectedFormattingChange={(selectionFormatting: StringMap) => {
            setToolbarFormatting(selectionFormatting);
          }}
        />

        <div className="flex justify-between border-t border-slate-200 pt-3">
          <div className="flex flex-row gap-2 items-center">
            <p
              className="text-slate-500 text-xs"
              onClick={() =>
                setUpdatedDateVisible(
                  (currentUpdatedDateVisible) => !currentUpdatedDateVisible
                )
              }
            >
              {editedNote.created.format("ddd D MMMM YYYY, hh:mm a")}
            </p>

            <p
              className={`${
                updatedDateVisible ? "visible" : "hidden"
              } text-slate-500 text-xs italic`}
            >
              {"(Last edited " +
                editedNote.updated.format("ddd D MMMM YYYY, hh:mm a") +
                ")"}
            </p>

            <TagMultiSelect
              initialTags={initialNote.tags}
              onChange={(tags) =>
                setEditedNote((currentEditedNote) => {
                  const newNoteData = {
                    ...currentEditedNote,
                    tags,
                  };

                  return newNoteData;
                })
              }
            />

            <Toggle
              colour={colours.red}
              isToggled={editedNote.isPinned}
              size="sm"
              onClick={() =>
                setEditedNote((currentEditedNote) => {
                  const newNoteData = {
                    ...currentEditedNote,
                    isPinned: !editedNote.isPinned,
                  };

                  return newNoteData;
                })
              }
              iconName="pushPin"
            />

            <Toggle
              isToggled={editedNote.isFlagged}
              size="sm"
              onClick={() =>
                setEditedNote((currentEditedNote) => {
                  const newNoteData = {
                    ...currentEditedNote,
                    isFlagged: !editedNote.isFlagged,
                  };

                  return newNoteData;
                })
              }
              iconName="flag"
            />
          </div>

          <Dialog.Close asChild>
            <Button
              colour={colours.red}
              variant="ghost"
              size="sm"
              iconName="trash"
              onClick={onDeleteNote}
            />
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default EditNoteModal;
