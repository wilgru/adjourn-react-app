import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextUnderline,
} from "@phosphor-icons/react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useLocation, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import Delta from "quill-delta";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { Toggle } from "src/components/controls/Toggle/Toggle";
import { QuillEditor } from "src/components/dataEntry/QuillEditor/QuillEditor";
import { colours } from "src/constants/colours.constant";
import { useCreateNote } from "src/hooks/notes/useCreateNote";
import { useDeleteNote } from "src/hooks/notes/useDeleteNote";
import { useUpdateNote } from "src/hooks/notes/useUpdateNote";
import { useCreateTask } from "src/hooks/tasks/useCreateTask";
import { TagMultiSelect } from "../TagMultiSelect/TagMultiSelect";
import { TaskEditor } from "../TaskEditor/TaskEditor";
import type { StringMap } from "quill";
import type { Colour } from "src/types/Colour.type";
import type { Note } from "src/types/Note.type";

type NoteEditorProps = {
  note?: Partial<Note>;
  colour?: Colour;
  onSave?: () => void;
};

const QUILL_TOOLBAR_ID = "toolbar";

const getInitialNote = (note: Partial<Note> | undefined): Note => {
  return {
    id: note?.id || "",
    title: note?.title || "",
    tasks: note?.tasks || [],
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

const NoteEditor = ({
  note,
  colour = colours.orange,
  onSave,
}: NoteEditorProps) => {
  const { createNote } = useCreateNote();
  const { createTask } = useCreateTask();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();

  const location = useLocation();
  const navigate = useNavigate();

  const [editedNote, setEditedNote] = useState<Note>(getInitialNote(note));
  const [toolbarFormatting, setToolbarFormatting] = useState<StringMap>();
  const [updatedDateVisible, setUpdatedDateVisible] = useState<boolean>();

  const onCreateTask = async () => {
    await createTask({
      createTaskData: {
        note: editedNote,
        title: "New task",
        isFlagged: false,
        link: null,
        description: "",
        dueDate: null,
        completedDate: null,
        cancelledDate: null,
      },
    });
  };

  const onUpdateNote = async (updateNoteData: Partial<Note>) => {
    setEditedNote((currentEditedNote) => {
      const newNoteData = {
        ...currentEditedNote,
        ...updateNoteData,
        updated: dayjs(),
      };

      return newNoteData;
    });

    const newNoteData = {
      ...editedNote,
      ...updateNoteData,
    };

    if (editedNote.id) {
      await updateNote({
        noteId: editedNote.id,
        updateNoteData: newNoteData,
      });
    } else {
      createNote({ createNoteData: newNoteData });
    }

    onSave?.();
  };

  const onDeleteNote = async () => {
    await deleteNote({ noteId: editedNote.id });

    navigate({
      to: location.pathname,
      search: {
        noteId: null,
      },
    });
  };

  if (!note) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-[1000px]">
      <div className="flex flex-col gap-2 justify-between border-b-2 border-slate-100 pb-4">
        <textarea
          name="title"
          value={editedNote.title ?? ""}
          placeholder="No Title"
          onChange={(e) => onUpdateNote({ title: e.target.value })}
          className="h-12 text-5xl font-title tracking-tight overflow-y-hidden bg-white placeholder-slate-400 select-none resize-none outline-none"
        />

        <div className="flex flex-row flex-wrap items-center justify-between">
          <div className="flex flex-row flex-wrap gap-2 items-center">
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
              initialTags={editedNote.tags}
              colour={colour}
              onChange={(tags) => onUpdateNote({ tags })}
            />

            {/* <Toggle
            colour={colours.red}
            isToggled={editedNote.isPinned}
            size="sm"
            onClick={() => onUpdateNote({ isPinned: !editedNote.isPinned })}
            iconName="pushPin"
          /> */}

            <Toggle
              isToggled={editedNote.isFlagged}
              size="sm"
              onClick={() => onUpdateNote({ isFlagged: !editedNote.isFlagged })}
              iconName="flag"
            />

            <Button
              size="sm"
              variant="ghost"
              colour={colour}
              onClick={onCreateTask}
              iconName="checkCircle"
            />

            <Button
              size="sm"
              variant="ghost"
              colour={colour}
              onClick={() => {}}
              iconName="chatCenteredText"
            />

            <p
              className="text-slate-500 text-xs"
              onClick={() =>
                setUpdatedDateVisible(
                  (currentUpdatedDateVisible) => !currentUpdatedDateVisible,
                )
              }
            >
              {editedNote.created.format("ddd D MMMM YYYY, hh:mm a")}
            </p>
          </div>

          <div className="flex flex-row flex-wrap gap-2 items-center">
            <Button
              size="sm"
              variant="ghost"
              colour={colours.red}
              onClick={onDeleteNote}
              iconName="trash"
            />
          </div>
        </div>
      </div>

      {note.tasks && note.tasks.length > 0 && (
        <div className="flex flex-col gap-2 justify-between border-b-2 border-slate-100 pb-4">
          {note.tasks.map((task) => (
            <TaskEditor key={task.id} task={task} />
          ))}
        </div>
      )}

      <div className="flex flex-row w-full">
        <div
          className="h-fit -ml-2 border-r-2 pr-1 border-slate-100"
          id={QUILL_TOOLBAR_ID}
        >
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

        <div className="flex flex-row gap-1 px-1">
          <Button
            colour={colours.blue}
            variant="ghost"
            size="sm"
            iconName="paperclip"
          />
        </div>
      </div>

      <QuillEditor
        toolbarId={QUILL_TOOLBAR_ID}
        initialValue={editedNote.content}
        onChange={(delta) => onUpdateNote({ content: delta })}
        onSelectedFormattingChange={(selectionFormatting: StringMap) => {
          setToolbarFormatting(selectionFormatting);
        }}
      />
    </div>
  );
};

export default NoteEditor;
