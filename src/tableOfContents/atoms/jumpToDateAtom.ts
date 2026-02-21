import { atom } from "jotai";
import type { Dayjs } from "dayjs";

export const jumpToDateAtom = atom<Dayjs | null>(null);
