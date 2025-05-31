import * as Dialog from "@radix-ui/react-dialog";
import { useState, forwardRef } from "react";
import EditSlipModal from "src/components/EditSlipModal/EditSlipModal";
import QuillContentView from "src/components/QuillContentView/QuillContentView";
import { SlipCardHeading } from "src/components/SlipCard/SlipCardHeading";
import { Button } from "src/components/controls/Button/Button";
import { Toggle } from "src/components/controls/Toggle/Toggle";
import { colours } from "src/constants/colours.constant";
import { useDeleteSlip } from "src/hooks/slips/useDeleteSlip";
import { useUpdateSlip } from "src/hooks/slips/useUpdateSlip";
import { cn } from "src/utils/cn";
import { isSlipContentEmpty } from "src/utils/slips/isSlipContentEmpty";
import type { Colour } from "src/types/Colour.type";
import type { Slip } from "src/types/Slip.type";

export const SlipCard = forwardRef<
  HTMLDivElement,
  { slip: Slip; colour: Colour }
>(function ({ slip, colour }, ref) {
  const { updateSlip } = useUpdateSlip();
  const { deleteSlip } = useDeleteSlip();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      id={slip.id}
      key={slip.id}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex flex-col relative p-2 rounded-md transition-colors",
        colour.backgroundGlow
      )}
    >
      <SlipCardHeading slip={slip} />

      {!isSlipContentEmpty(slip.content) && (
        <QuillContentView content={slip.content} />
      )}

      <div
        hidden={!isHovered}
        className="absolute p-2 -left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex flex-col gap-2 p-1 bg-white border border-slate-300 rounded-full drop-shadow-md">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                colour={colour}
                iconName="pencil"
                variant="ghost"
                size="sm"
              />
            </Dialog.Trigger>

            <Toggle
              onClick={() => {
                updateSlip({
                  slipId: slip.id,
                  updateSlipData: {
                    ...slip,
                    isFlagged: !slip.isFlagged,
                  },
                });
              }}
              isToggled={slip.isFlagged}
              iconName="flag"
              size="sm"
            />

            <Button
              onClick={() => {
                deleteSlip({ slipId: slip.id });
              }}
              colour={colours.red}
              iconName="trash"
              variant="ghost"
              size="sm"
            />

            <EditSlipModal slip={slip} />
          </Dialog.Root>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        {slip.created.format("ddd D MMMM YYYY")}
      </p>
    </div>
  );
});
