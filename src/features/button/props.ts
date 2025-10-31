import { ReactNode } from "react";

export type ButtonStyle =
  | "primary"
  | "secondary"
  | "frosted glass"
  | "transparent";

type BaseButtonProps = {
  /**
   * Whether the button is disabled. A disabled button cannot be clicked and will
   * have a distinct style.
   * @default false
   */
  disabled?: boolean;
};

type LinkButtonProps = {
  /**
   * Whether the button is a link. A link button uses the Next.js `Link` component, and
   * must have an `href` prop.
   * @default false
   */
  isLink: true;
  /**
   * The URL to navigate to when the button is clicked. Required for link buttons, and
   * must not be provided for non-link buttons.
   */
  href: string;
  /**
   * The function to call when the button is clicked. Required for non-link buttons,
   * and must not be provided for link buttons.
   *
   * The function can return a boolean or a Promise that resolves to a boolean, indicating
   * whether the action was successful.
   */
  onClick?: never;
  /**
   * If `true`, the button will return to a normal state no matter the result of `onClick`.
   *
   * If `false`, the button will stay in a loading state after a successful action. This
   * behavior should be used for buttons that trigger navigation, to avoid multiple clicks
   * before the new page loads.
   * @default true
   */
  releaseOnSuccess?: never;
  /**
   * If `true`, the button will show a loading spinner and be unclickable.
   * 
   * Typically, the loading state is managed internally by the button when `onClick` is
   * provided. However, this can be helpful if a button shouldn't be accessible until
   * something else has loaded.
   * 
   * This prop is only valid for non-link buttons.
   * @default false
   */
  loading?: never;
};

type ActionButtonProps = {
  isLink?: false;
  href?: never;
  onClick: () => Promise<boolean> | boolean;
  releaseOnSuccess?: boolean;
  loading?: boolean;
};

type TransparentButtonProps = {
  /**
   * The style of the button. There are four styles:
   * - `primary`: An important button, filled with the main accent color.
   * - `secondary`: A less important button, outlined with the main accent color.
   * - `frosted glass`: A button with a frosted glass appearance, used only in the header.
   * - `transparent`: A button with no background until hovered.
   *
   * `transparent` buttons cannot have icons.
   */
  style: "transparent";
  /**
   * The icon to display in the button.
   *
   * Should not include a className prop for styling, since it will be overridden.
   */
  icon?: never;
  /**
   * The text label of the button.
   *
   * If `shrinkOnMobile` is `true`, the label will be hidden on small screens.
   */
  label: string;
  /**
   * If `true`, the button will hide its label on small screens, showing only the
   * icon.
   *
   * This prop requires both an icon and a label to be provided.
   * @default false
   */
  shrinkOnMobile?: never;
};

type NonTransparentButtonProps = {
  style: Exclude<ButtonStyle, "transparent">;
} &
  // Must have either icon or label
  (| {
    icon: ReactNode;
    label?: string;
    shrinkOnMobile?: never;
  }
    | { icon?: ReactNode; label: string; shrinkOnMobile?: never }
    // shrinkOnMobile only allowed if both icon and label are present
    | {
      icon: ReactNode;
      label: string;
      shrinkOnMobile: boolean;
    }
  );

export type ButtonProps = BaseButtonProps &
  (LinkButtonProps | ActionButtonProps) &
  (TransparentButtonProps | NonTransparentButtonProps);