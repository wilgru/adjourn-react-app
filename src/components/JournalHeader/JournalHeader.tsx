import { cn } from "src/utils/cn";
import { Icon } from "../Icon/Icon";
import type { Journal } from "src/types/Journal.type";
import type { SlipsGroupDividedByTitle } from "src/types/Slip.type";

type JournalHeaderProps = {
  journal: Journal;
  slipGroups: SlipsGroupDividedByTitle[];
};

export const JournalHeader = ({ journal, slipGroups }: JournalHeaderProps) => {
  return (
    <div className="pb-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Icon
            className={cn(journal.colour.text)}
            iconName={journal.icon}
            size="xl"
          />

          <h1 className="font-title text-5xl">{journal.name}</h1>
        </div>

        <div className="flex gap-1"></div>
      </div>

      <div className="flex gap-1">
        <h3
          className={cn(
            "px-2 py-0.5 text-sm rounded-full",
            journal.colour.backgroundPill,
            journal.colour.textPill
          )}
        >
          {slipGroups.length} sections
        </h3>

        <h3
          className={cn(
            "px-2 py-0.5 text-sm rounded-full",
            journal.colour.backgroundPill,
            journal.colour.textPill
          )}
        >
          {journal.slipCount} notes
        </h3>
      </div>
    </div>
  );
};
