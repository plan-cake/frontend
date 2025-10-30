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
  let paddingClasses = "";
  if (icon) {
    if (label) {
      // don't use isMobile so this can be used on server-rendered components
      paddingClasses = shrinkOnMobile ? "p-2 md:pr-4" : "p-2 pr-4";
    } else {
      paddingClasses = "p-2";
    }
  } else {
    paddingClasses = "px-4 py-2";
  }

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
