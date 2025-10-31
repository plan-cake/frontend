import { forwardRef } from "react";

import BaseButton from "@/features/button/components/base-button";
import { ActionButtonProps } from "@/features/button/props";

type Ref = HTMLButtonElement;

const ActionButton = forwardRef<Ref, ActionButtonProps>(
  (
    {
      buttonStyle,
      icon,
      label,
      shrinkOnMobile = false,
      loading = false,
      disabled = false,
      onClick,
      loadOnSuccess = false,
      ...props
    },
    ref,
  ) => {
    return (
      <BaseButton
        buttonStyle={buttonStyle}
        icon={icon}
        label={label}
        shrinkOnMobile={shrinkOnMobile}
        loading={loading}
        disabled={disabled}
        isLink={false}
        onClick={onClick}
        loadOnSuccess={loadOnSuccess}
        ref={ref}
        {...props}
      />
    );
  },
);

ActionButton.displayName = "ActionButton";
export default ActionButton;
