import BaseButton from "@/features/button/components/base-button";
import { LinkButtonProps } from "@/features/button/props";

export default function LinkButton({
  style,
  icon,
  label,
  shrinkOnMobile = false,
  loading = false,
  disabled = false,
  href,
}: LinkButtonProps) {
  return (
    <BaseButton
      style={style}
      icon={icon}
      label={label}
      shrinkOnMobile={shrinkOnMobile}
      loading={loading}
      disabled={disabled}
      isLink={true}
      href={href}
    />
  );
}
