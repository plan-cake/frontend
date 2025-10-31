import { DashboardIcon } from "@radix-ui/react-icons";

import LinkButton from "@/features/button/components/link-button";

export default function DashboardButton() {
  return (
    <LinkButton
      buttonStyle="frosted glass"
      icon={<DashboardIcon className="h-5 w-5" />}
      href="/dashboard"
    />
  );
}
