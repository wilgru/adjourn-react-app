import { atom } from "jotai";
import type { Note } from "src/types/Note.type";

export const editNoteDataAtom = atom<Partial<Note> | undefined>(undefined);
