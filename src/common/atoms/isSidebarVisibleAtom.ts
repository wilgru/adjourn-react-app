import { atomWithLocalStorage } from "src/common/utils/atomWithLocalStorage";

export const isSideBarVisibleAtom = atomWithLocalStorage<boolean>(
  "isSideBarVisible",
  true,
);
