import { cva } from "class-variance-authority";
import { useState } from "react";
import { Icon } from "src/components/general/Icon/Icon";
import { colours } from "src/constants/colours.constant";
import { cn } from "src/utils/cn";
import type { Colour } from "src/types/Colour.type";

type ButtonProps = {
  children?: React.ReactNode;
  variant?: "block" | "ghost" | "ghost-strong" | "link";
  colour?: Colour;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  iconName?: string;
};

const buttonVariants = cva(
  [
    "w-fit",
    "flex",
    "items-center",
    "gap-2",
    "rounded-full",
    "transition-colors",
    "focus-visible:outline",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-orange-500",
  ],
  {
    variants: {
      variant: {
        block: null,
        ghost: "text-slate-500",
        "ghost-strong": "text-slate-300",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        sm: "text-xs font-normal",
        md: "text-sm font-medium",
        lg: "text-md font-medium",
      },
      content: {
        text: null,
        icon: null,
        iconAndText: null,
      },
    },
    compoundVariants: [
      // text only
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "text",
        size: "sm",
        className: "py-1 px-2",
      },
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "text",
        size: "md",
        className: "py-2 px-3",
      },
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "text",
        size: "lg",
        className: "py-3 px-4",
      },
      // icons only
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "icon",
        size: "sm",
        className: "p-1",
      },
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "icon",
        size: "md",
        className: "p-2",
      },
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "icon",
        size: "lg",
        className: "p-3",
      },
      //  icons and text
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "iconAndText",
        size: "sm",
        className: "py-1 pl-1 pr-2",
      },
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "iconAndText",
        size: "md",
        className: "py-2 pl-2 pr-3",
      },
      {
        variant: ["block", "ghost", "ghost-strong"],
        content: "iconAndText",
        size: "lg",
        className: "py-3 pl-3 pr-4",
      },
    ],
    defaultVariants: {
      variant: "block",
      size: "md",
    },
  }
);

export const Button = ({
  children,
  type = "button",
  variant = "block",
  size = "md",
  colour = colours.orange,
  className,
  disabled = false,
  onClick,
  iconName,
}: ButtonProps) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const content =
    iconName && children
      ? "iconAndText"
      : iconName && !children
        ? "icon"
        : "text";

  return (
    <button
      type={type}
      className={cn(
        buttonVariants({
          size,
          variant,
          content,
        }),
        variant === "block" && colour.textPill,
        variant === "block" && colour.backgroundPill,
        variant === "block" && colour.textPillInverted,
        variant === "block" && colour.backgroundPillInverted,
        variant === "ghost" && `hover:${colour.textPill}`,
        variant === "ghost" && `hover:${colour.backgroundPill}`,
        variant === "ghost-strong" && `hover:${colour.textPill}`,
        variant === "ghost-strong" && `hover:${colour.backgroundPill}`,
        className
      )}
      disabled={disabled}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
      onClick={onClick}
    >
      {iconName && (
        <Icon
          iconName={iconName}
          size={size}
          className={cn(isButtonHovered && colour.textPill)}
          weight={isButtonHovered ? "fill" : "regular"}
        />
      )}
      {children}
    </button>
  );
};
