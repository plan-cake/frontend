import { ReactNode, ReactElement, cloneElement } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils/classname";

type ButtonStyle = "primary" | "secondary" | "frosted glass" | "transparent";

type ButtonProps = {
  style: ButtonStyle;
  icon?: ReactNode;
  label?: string;
  shrinkOnMobile?: boolean;
  // tooltip?: string; // TODO: implement tooltips
  // disabled?: boolean; // TODO: implement disabled state
  isLink?: boolean;
  href?: string;
  onClick?: () => boolean;
};

export default function Button({
  style,
  icon,
  label,
  shrinkOnMobile,
  // tooltip,
  // disabled = false,
  isLink = false,
  href,
  onClick,
}: ButtonProps) {
  // validate props
  if (!icon && !label) throw new Error("Button must have an icon or a label");
  if (shrinkOnMobile && (!icon || !label))
    throw new Error(
      "Button cannot shrink on mobile without both an icon and a label",
    );
  if (isLink && !href) throw new Error("Link Button must specify href");
  if (!isLink && !onClick)
    throw new Error("Non-Link Button must specify onClick");

  // TODO: implement loading/waiting state

  const baseClasses =
    "rounded-full font-medium flex flex-row items-center gap-1";
  const cursorClass = "cursor-pointer"; // will change later with disabled and loading
  const labelClass = shrinkOnMobile ? "hidden md:block" : "";

  let paddingShrink = 0;
  let styleClasses;
  switch (style) {
    case "primary":
      styleClasses = "bg-blue dark:bg-red text-white";
      break;
    case "secondary":
      styleClasses = ""; // TODO: add secondary style
      break;
    case "frosted glass":
      styleClasses = ""; // TODO: add frosted glass style
      break;
    case "transparent":
      styleClasses = ""; // TODO: add transparent style
      break;
  }

  const paddingClasses = getPaddingClasses(
    icon,
    label,
    shrinkOnMobile,
    paddingShrink,
  );

  // pretty ugly, but it allows the icon to be specified without a className for DRY
  // instead, we specify the styling (really just the size) here
  const iconComponent =
    icon &&
    cloneElement(icon as ReactElement<{ className: string }>, {
      className: "h-6 w-6 p-0.5",
    });

  const buttonContent = (
    <div className={cn(baseClasses, cursorClass, paddingClasses, styleClasses)}>
      {icon && iconComponent}
      {label && <span className={labelClass}>{label}</span>}
    </div>
  );

  if (isLink) {
    return <Link href={href!}>{buttonContent}</Link>;
  } else {
    return <button onClick={onClick}>{buttonContent}</button>;
  }
}

// I know this looks bad, but tailwind needs the full class names to be defined
function getPaddingClasses(
  icon?: ReactNode,
  label?: string,
  shrinkOnMobile?: boolean,
  paddingShrink?: number,
) {
  let paddingClasses = "";
  switch (paddingShrink) {
    case 0.5:
      paddingClasses = "p-1.5 ";
      break;
    case 0.25:
      paddingClasses = "p-1.75 ";
      break;
    default:
      paddingClasses = "p-2 ";
      break;
  }
  if (icon) {
    if (label) {
      switch (paddingShrink) {
        case 0.5:
          paddingClasses += shrinkOnMobile ? "md:pr-3.5" : "pr-3.5";
          break;
        case 0.25:
          paddingClasses += shrinkOnMobile ? "md:pr-3.75" : "pr-3.75";
          break;
        default:
          paddingClasses += shrinkOnMobile ? "md:pr-4" : "pr-4";
          break;
      }
    }
  } else {
    switch (paddingShrink) {
      case 0.5:
        paddingClasses += "px-3.5";
        break;
      case 0.25:
        paddingClasses += "px-3.75";
        break;
      default:
        paddingClasses += "px-4";
        break;
    }
  }
  return paddingClasses;
}
