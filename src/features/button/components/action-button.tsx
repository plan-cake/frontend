import BaseButton from "@/features/button/components/base-button";
import { ActionButtonProps } from "@/features/button/props";

export default function ActionButton({
  style,
  icon,
  label,
  shrinkOnMobile = false,
  loading = false,
  disabled = false,
  onClick,
  loadOnSuccess = false,
}: ActionButtonProps) {
  return (
    <BaseButton
      style={style}
      icon={icon}
      label={label}
      shrinkOnMobile={shrinkOnMobile}
      loading={loading}
      disabled={disabled}
      isLink={false}
      onClick={onClick}
      loadOnSuccess={loadOnSuccess}
    />
  );
}
