import { atom } from "jotai";
import type { StringMap } from "quill";
import type { Colour } from "src/colours/Colour.type";

type QuillEditorState = {
  isQuillFocused: boolean;
  toolbarFormatting: StringMap | undefined;
  colour: Colour | undefined;
};

export const quillEditorStateAtom = atom<QuillEditorState>({
  isQuillFocused: false,
  toolbarFormatting: undefined,
  colour: undefined,
});
