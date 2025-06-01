import { useMemo } from "react";
import type { TableOfContentsItem } from "src/components/TableOfContents/TableOfContents";
import type { Slip } from "src/types/Slip.type";

export const useTaskAndNotesTOCItems = (
  slips: Slip[]
): TableOfContentsItem[] => {
  return useMemo(() => {
    const slipItems = slips.map((slip) => {
      let slipTitle = slip.title;

      if (!slipTitle && typeof slip.content.ops[0].insert === "string") {
        slipTitle = slip.content.ops[0].insert;
      }

      return {
        title: slipTitle ?? "No Title",
        italic: !slip.title,
        navigationId: slip.id,
        subItems: [],
      };
    });

    return [
      {
        title: "Tasks",
        navigationId: null,
        subItems: [],
      },
      {
        title: "Notes",
        navigationId: null,
        subItems: slipItems,
      },
    ];
  }, [slips]);
};
