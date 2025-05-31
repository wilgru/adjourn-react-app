import { atomWithLocalStorage } from "src/utils/atomWithLocalStorage";

export const isSideBarVisibleAtom = atomWithLocalStorage<boolean>(
  "isSideBarVisible",
  true
);
