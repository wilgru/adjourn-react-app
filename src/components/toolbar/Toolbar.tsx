import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { colours } from "src/constants/colours.constant";
import { useLogin } from "src/hooks/users/useLogin";
import { Button } from "../controls/Button/Button";

type ToolbarProps = {
  title: string;
  titleItems: JSX.Element[];
};

export const Toolbar = ({ title, titleItems }: ToolbarProps) => {
  const navigate = useNavigate();
  const { logout } = useLogin();

  return (
    <div className="flex items-center justify-between p-3 bg-white">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-title text-slate-500">{title}</h1>

        {titleItems.map((titleItem) => titleItem)}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div>
              <Button
                variant="block"
                colour={colours.blue}
                iconName="user"
                size="sm"
              />
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
