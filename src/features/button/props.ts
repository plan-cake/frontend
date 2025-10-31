import { ReactNode } from "react";

export type ButtonStyle =
  | "primary"
  | "secondary"
  | "frosted glass"
  | "transparent";

type BaseButtonProps = {
  disabled?: boolean;
};

type LinkButtonProps = {
  isLink: true;
  href: string;
  onClick?: never;
  releaseOnSuccess?: never;
};

type ActionButtonProps = {
  isLink?: false;
  href?: never;
  onClick: () => Promise<boolean> | boolean;
  /**
   * If true, the button will return to a normal state no matter the result of `onClick`.
   *
   * If false, the button will stay in a loading state after a successful action. This
   * behavior should be used for buttons that trigger navigation.
   * @default true
   */
  releaseOnSuccess?: boolean;
};

type TransparentButtonProps = {
  style: "transparent";
  icon?: never;
  label: string;
  shrinkOnMobile?: never;
};

type NonTransparentButtonProps = {
  style: Exclude<ButtonStyle, "transparent">;
} &
  // Must have either icon or label
  (| { icon: ReactNode; label?: string; shrinkOnMobile?: never }
    | { icon?: ReactNode; label: string; shrinkOnMobile?: never }
    // shrinkOnMobile only allowed if both icon and label are present
    | { icon: ReactNode; label: string; shrinkOnMobile: boolean }
  );

export type ButtonProps = BaseButtonProps &
  (LinkButtonProps | ActionButtonProps) &
  (TransparentButtonProps | NonTransparentButtonProps);
