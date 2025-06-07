import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useState } from "react";
import { isSideBarVisibleAtom } from "src/atoms/isSidebarVisibleAtom";
import { colours } from "src/constants/colours.constant";
import { useLogin } from "src/hooks/users/useLogin";
import EditSlipModal from "../EditSlipModal/EditSlipModal";
import { Button } from "../controls/Button/Button";
import type { Colour } from "src/types/Colour.type";

type ToolbarProps = {
  iconName?: string;
  title: string;
  colour?: Colour;
  titleItems: JSX.Element[];
};

export const Toolbar = ({
  iconName,
  title,
  colour = colours.orange,
  titleItems,
}: ToolbarProps) => {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const [isSideBarVisible, setValue] = useAtom(isSideBarVisibleAtom);
  const [showEditSlipModal, setShowEditSlipModal] = useState(false);

  //TODO: remove h-16 when scrolling issue is fixed
  return (
    <div className="bg-white w-full h-16 flex items-center justify-between p-3">
      <div className="flex gap-2">
        {!isSideBarVisible && (
          <Button
            variant="ghost"
            colour={colour}
            iconName="arrowLineRight"
            onClick={() => setValue(true)}
          />
        )}

        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-full drop-shadow-md p-1">
          <Button size="sm" variant="ghost" iconName={iconName} colour={colour}>
            {title}
          </Button>

          {titleItems.map((titleItem) => titleItem)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button
              variant="ghost"
              colour={colour}
              iconName="plus"
              onClick={() => setShowEditSlipModal(true)}
            />
          </Dialog.Trigger>
          {showEditSlipModal && (
            <EditSlipModal
              onSave={() => {
                setShowEditSlipModal(false);
              }}
            />
          )}
        </Dialog.Root>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div>
              <Button variant="block" colour={colours.blue} iconName="user" />
            </div>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="flex flex-col gap-2 bg-white border border-slate-200 text-sm rounded-2xl p-2 w-40 drop-shadow"
              sideOffset={2}
              align="start"
            >
              <DropdownMenu.Item
                className="leading-none text-sm p-2 outline-none rounded-xl cursor-pointer data-[highlighted]:bg-orange-100 data-[highlighted]:text-orange-500 transition-colors"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                Account Settings
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-[1px] rounded-full bg-slate-200" />

              <DropdownMenu.Item
                className="leading-none text-red-400 text-sm p-2 outline-none rounded-xl cursor-pointer data-[highlighted]:bg-red-100 data-[highlighted]:text-red-500 transition-colors"
                onClick={() => {
                  logout();
                  navigate({ to: "/login" });
                }}
              >
                Log out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
