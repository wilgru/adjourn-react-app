import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "src/common/components/Button/Button";
import { CreateTagModal } from "src/tags/components/CreateTagModal/CreateTagModal";

export const SidebarTagSection = ({
  title,
  tagGroupId,
  children,
}: {
  title: string;
  tagGroupId?: string;
  children: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="flex flex-col gap-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <div className="flex flex-row items-center gap-1">
          <h1 className="font-title text-slate-400 text-md">{title}</h1>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              {isHovered && (
                <Button
                  className="mb-1"
                  variant="ghost-strong"
                  size="xs"
                  iconName="plus"
                />
              )}
            </Dialog.Trigger>

            <CreateTagModal tagGroupId={tagGroupId} />
          </Dialog.Root>
        </div>
        {children}
      </div>
    </section>
  );
};
