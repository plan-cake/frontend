"use client";

import { ReactElement, ReactNode, cloneElement, useState } from "react";

import Link from "next/link";

import LoadingSpinner from "@/components/loading-spinner";
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
  onClick?: () => Promise<boolean> | boolean;
};

export default function Button({
  style,
  icon,
  label,
  shrinkOnMobile = false,
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

  const [isLoading, setIsLoading] = useState(false);
  const onClickHandler = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await onClick!();
    setIsLoading(false);
  };

  const baseClasses =
    "rounded-full font-medium flex flex-row items-center gap-1 relative";
  const loadingHideClass = isLoading ? "opacity-0" : "";
  const cursorClass = isLoading ? "cursor-wait" : "cursor-pointer"; // will change later with disabled
  const styleClasses = getStyleClasses(style, !!icon, !!label, shrinkOnMobile);
  const labelClass = shrinkOnMobile ? "hidden md:block" : "";

  // pretty ugly, but it allows the icon to be specified without a className for DRY
  // instead, we specify the styling (really just the size) here
  const iconComponent =
    icon &&
    cloneElement(icon as ReactElement<{ className: string }>, {
      className: cn("h-6 w-6 p-0.5", loadingHideClass),
    });

  const buttonContent = (
    <div className={cn(baseClasses, cursorClass, styleClasses)}>
      {icon && iconComponent}
      {label && (
        <span className={cn(labelClass, loadingHideClass)}>{label}</span>
      )}
      {isLoading && <LoadingSpinner className="centered-absolute h-5 w-5" />}
    </div>
  );

  if (isLink) {
    return <Link href={href!}>{buttonContent}</Link>;
  } else {
    return <button onClick={onClickHandler}>{buttonContent}</button>;
  }
}

function getStyleClasses(
  style: ButtonStyle,
  hasIcon: boolean,
  hasLabel: boolean,
  shrinkOnMobile: boolean,
) {
  let paddingShrink = 0;
  let styleClasses;
  switch (style) {
    case "primary":
      styleClasses = "bg-blue dark:bg-red text-white";
      break;
    case "secondary":
      styleClasses =
        "border-blue dark:border-red dark:hover:bg-red/25 border-2 hover:bg-blue/25";
      paddingShrink = 0.5;
      break;
    case "frosted glass":
      styleClasses = "frosted-glass";
      paddingShrink = 0.25;
      break;
    case "transparent":
      styleClasses = "hover:bg-blue/25 dark:hover:bg-red/25";
      break;
  }
  const paddingClasses = getPaddingClasses(
    hasIcon,
    hasLabel,
    shrinkOnMobile,
    paddingShrink,
  );
  return cn(styleClasses, paddingClasses);
}

// I know this looks bad, but tailwind needs the full class names to be defined
function getPaddingClasses(
  hasIcon?: boolean,
  hasLabel?: boolean,
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
  if (hasIcon) {
    if (hasLabel) {
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
