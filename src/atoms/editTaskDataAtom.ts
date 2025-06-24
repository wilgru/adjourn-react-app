import { atom } from "jotai";
import type { Task } from "src/types/Task.type";

export const editTaskDataAtom = atom<Partial<Task> | undefined>(undefined);
