import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "src/components/controls/Button/Button";

type LabelProps = {
  title: string;
  tooltipContent?: string;
};

export const Label = ({ title, tooltipContent }: LabelProps): JSX.Element => {
  return (
    <h3 className="flex items-center gap-0.5 mb-1 text-sm text-slate-500">
      {title}

      {tooltipContent && (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button iconName="info" variant="ghost" size="sm" />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="max-w-64 select-none rounded-xl border border-slate-500 bg-slate-800 px-4 py-2 text-sm text-white shadow-md will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                sideOffset={5}
              >
                {tooltipContent}
                <Tooltip.Arrow className="fill-slate-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </h3>
  );
};
