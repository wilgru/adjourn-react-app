import { PushPin, Flag } from "@phosphor-icons/react";
import type { Slip } from "src/types/Slip.type";

type SlipCardHeadingProps = {
  slip: Slip;
};

export const SlipCardHeading = ({ slip }: SlipCardHeadingProps) => {
  return (
    <div className="flex flex-col gap-1 pb-1 transition-colors">
      <div className="flex gap-2 items-baseline">
        {slip.title && (
          <h1 className="font-title text-3xl font-normal tracking-tight">
            {slip.title}
          </h1>
        )}

        {slip.isPinned && (
          <PushPin weight="fill" className="w-5 h-5 text-red-400" />
        )}

        {slip.isFlagged && (
          <Flag weight="fill" className="w-5 h-5 text-orange-400" />
        )}
      </div>
    </div>
  );
};
