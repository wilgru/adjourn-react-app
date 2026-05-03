import { useAtom, useAtomValue } from "jotai";
import { colours } from "src/colours/colours.constant";
import { isSideBarVisibleAtom } from "src/common/atoms/isSidebarVisibleAtom";
import { quillEditorStateAtom } from "src/common/atoms/quillEditorStateAtom";
import { Button } from "src/common/components/Button/Button";
import { QuillFormattingToolbar } from "src/common/components/QuillFormattingToolbar/QuillFormattingToolbar";
import { useElectronEnvironment } from "src/common/hooks/useElectronEnvironment";
import { cn } from "src/common/utils/cn";
import { Icon } from "src/icons/components/Icon/Icon";
import { NoteSearchBar } from "src/notes/components/NoteSearchBar/NoteSearchBar";
import type { Colour } from "src/colours/Colour.type";

type ToolbarProps = {
  iconName?: string;
  title: string;
  colour?: Colour;
  pocketbookColour?: Colour;
  children?: JSX.Element;
};

export const Toolbar = ({
  iconName,
  title,
  colour = colours.orange,
  pocketbookColour,
  children,
}: ToolbarProps) => {
  const { isMacElectron } = useElectronEnvironment();

  const [isSideBarVisible, setValue] = useAtom(isSideBarVisibleAtom);
  const { isQuillFocused, toolbarFormatting, colour: quillColour } = useAtomValue(quillEditorStateAtom);
  const shouldReserveWindowButtonSpace = isMacElectron && !isSideBarVisible;

  //TODO: remove h-16 when scrolling issue is fixed
  return (
    <div
      className={cn(
        "bg-white w-full min-h-16 flex items-center justify-between p-3",
        isMacElectron ? "electron-drag-region" : "",
      )}
    >
      <div className="flex items-center gap-2">
        {shouldReserveWindowButtonSpace && <div className="h-8 w-[4.5rem]" />}

        <div className={cn("flex gap-2", isMacElectron && "electron-no-drag")}>
          {!isSideBarVisible && (
            <Button
              variant="ghost"
              size="sm"
              colour={pocketbookColour ?? colour}
              iconName="arrowLineRight"
              onClick={() => setValue(true)}
            />
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {iconName && (
                <Icon
                  className={cn("pb-1", colour.text)}
                  iconName={iconName}
                  size="md"
                />
              )}
              <h1 className="font-title text-xl">{title}</h1>
            </div>

            {children}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-2",
          isMacElectron ? "electron-no-drag" : "",
        )}
      >
        <div className={cn(!isQuillFocused && "hidden")}>
          <QuillFormattingToolbar
            toolbarId="toolbar"
            toolbarFormatting={toolbarFormatting}
            colour={quillColour ?? colour}
          />
        </div>
        <NoteSearchBar />
      </div>
    </div>
  );
};
