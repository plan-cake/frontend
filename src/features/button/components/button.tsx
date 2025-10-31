"use client";

import { ReactElement, cloneElement, useState } from "react";

import Link from "next/link";

import LoadingSpinner from "@/components/loading-spinner";
import { ButtonProps, ButtonStyle } from "@/features/button/props";
import { cn } from "@/lib/utils/classname";

type ButtonState = "rest" | "loading" | "disabled";

export default function Button({
  style,
  icon,
  label,
  shrinkOnMobile = false,
  disabled = false,
  isLink = false,
  href,
  onClick,
  releaseOnSuccess = true,
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
  if (style === "transparent" && icon)
    throw new Error("Transparent Button cannot have an icon");

  const [isLoading, setIsLoading] = useState(false);
  const onClickHandler = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const success = await onClick!();
    if (!releaseOnSuccess) {
      if (!success) {
        setIsLoading(false);
      }
      return;
    } else {
      setIsLoading(false);
    }
  };

  const baseClasses =
    "rounded-full font-medium flex flex-row items-center gap-1 relative";
  const loadingHideClass = isLoading ? "opacity-0" : "";
  const cursorClass = isLoading
    ? "cursor-default"
    : disabled
      ? "cursor-not-allowed"
      : "cursor-pointer";
  const buttonState = isLoading ? "loading" : disabled ? "disabled" : "rest";
  const [styleClasses, spinnerClasses] = getStyleClasses(
    style,
    !!icon,
    !!label,
    buttonState,
    shrinkOnMobile,
  );
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
      {isLoading && (
        <LoadingSpinner
          className={cn("centered-absolute h-5 w-5", spinnerClasses)}
        />
      )}
    </div>
  );

  if (disabled || isLoading) {
    return <div>{buttonContent}</div>;
  } else if (isLink) {
    return <Link href={href!}>{buttonContent}</Link>;
  } else {
    return <button onClick={onClickHandler}>{buttonContent}</button>;
  }
}

function getStyleClasses(
  style: ButtonStyle,
  hasIcon: boolean,
  hasLabel: boolean,
  state: ButtonState,
  shrinkOnMobile: boolean,
) {
  let paddingShrink = 0;
  let styleClasses;
  let spinnerClasses = "border-white";
  switch (style) {
    case "primary":
      switch (state) {
        case "rest":
          styleClasses = cn(
            "bg-blue dark:bg-red text-white",
            "active:bg-[color-mix(in_oklab,var(--color-blue)_100%,black_10%)]",
            "dark:active:bg-[color-mix(in_oklab,var(--color-red)_100%,black_10%)]",
            "hover:bg-[color-mix(in_oklab,var(--color-blue)_100%,white_10%)]",
            "dark:hover:bg-[color-mix(in_oklab,var(--color-red)_100%,white_10%)]",
          );
          break;
        case "loading":
          styleClasses = cn(
            "bg-blue-500 dark:bg-red-200 text-white/50",
            "bg-[color-mix(in_oklab,var(--color-blue)_100%,black_20%)]",
            "dark:bg-[color-mix(in_oklab,var(--color-red)_100%,black_20%)]",
          );
          break;
        case "disabled":
          styleClasses =
            "bg-gray-200 text-[#ffffff] dark:bg-gray-300/25 dark:text-gray-300";
          break;
      }
      break;
    case "secondary":
      switch (state) {
        case "rest":
          styleClasses = cn(
            "border-blue dark:border-red dark:hover:bg-red/25 border-2 hover:bg-blue/25",
            "active:bg-blue/40 dark:active:bg-red/40",
          );
          break;
        case "loading":
          styleClasses =
            "border-blue border-2 dark:border-red bg-blue/40 dark:bg-red/40";
          break;
        case "disabled":
          styleClasses =
            "border-gray-200 border-2 text-gray-300 dark:border-gray-400";
          break;
      }
      paddingShrink = 0.5;
      spinnerClasses = "border-violet dark:border-white";
      break;
    case "frosted glass":
      switch (state) {
        case "rest":
          styleClasses = "frosted-glass frosted-glass-button";
          break;
        case "loading":
          styleClasses = "frosted-glass frosted-glass-button-loading";
          break;
        case "disabled":
          styleClasses = "frosted-glass text-violet/40 dark:text-white/40";
          break;
      }
      paddingShrink = 0.25;
      spinnerClasses = "border-violet dark:border-white";
      break;
    case "transparent":
      switch (state) {
        case "rest":
          styleClasses = cn(
            "text-blue dark:text-red font-bold hover:bg-blue/25 dark:hover:bg-red/25",
            "active:bg-blue/40 dark:active:bg-red/40",
          );
          break;
        case "loading":
          styleClasses = "font-bold bg-blue/20 dark:bg-red/20";
          break;
        case "disabled":
          styleClasses = "font-bold text-gray-300 dark:text-gray-400";
          break;
      }
      spinnerClasses = "border-blue dark:border-red";
      break;
  }
  const paddingClasses = getPaddingClasses(
    hasIcon,
    hasLabel,
    shrinkOnMobile,
    paddingShrink,
  );
  return [cn(styleClasses, paddingClasses), spinnerClasses];
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
