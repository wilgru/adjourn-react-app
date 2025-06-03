import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { useState, forwardRef } from "react";
import { jumpToDateAtom } from "src/atoms/jumpToDateAtom";
import EditSlipModal from "src/components/EditSlipModal/EditSlipModal";
import QuillContentView from "src/components/QuillContentView/QuillContentView";
import { SlipCardHeading } from "src/components/SlipCard/SlipCardHeading";
import { Button } from "src/components/controls/Button/Button";
import { Toggle } from "src/components/controls/Toggle/Toggle";
import { colours } from "src/constants/colours.constant";
import { useDeleteSlip } from "src/hooks/slips/useDeleteSlip";
import { useUpdateSlip } from "src/hooks/slips/useUpdateSlip";
import { cn } from "src/utils/cn";
import { getNavigationDay } from "src/utils/getNavigationDay";
import { isSlipContentEmpty } from "src/utils/slips/isSlipContentEmpty";
import { TagPill } from "../TagPill/TagPill";
import type { Colour } from "src/types/Colour.type";
import type { Slip } from "src/types/Slip.type";

export const SlipCard = forwardRef<
  HTMLDivElement,
  { slip: Slip; colour?: Colour }
>(function ({ slip, colour = colours.orange }, ref) {
  const navigate = useNavigate();
  const { updateSlip } = useUpdateSlip();
  const { deleteSlip } = useDeleteSlip();
  const setJumpToAtom = useSetAtom(jumpToDateAtom);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      id={slip.id}
      key={slip.id}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex flex-col gap-0.5 relative p-2 rounded-md transition-colors",
        colour.backgroundGlow
      )}
    >
      <SlipCardHeading slip={slip} />

      <div className="flex items-center flex-wrap -ml-2">
        <Button
          colour={colour}
          variant="ghost"
          size="sm"
          onClick={() => {
            navigate({ to: `/day/${getNavigationDay(slip.created)}` });
            setJumpToAtom(slip.created);
          }}
        >
          {slip.created.format("ddd MMM D, YYYY")}
        </Button>

        {slip.tags.map((tag) => (
          <TagPill
            key={tag.id}
            tag={tag}
            size="sm"
            variant="ghost"
            closable={false}
            onClick={(tagId) => {
              navigate({ to: `/tags/${tagId}` });
            }}
          />
        ))}
      </div>

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
    </div>
  );
});
