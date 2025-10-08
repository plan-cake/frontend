import { cn } from "@/app/_lib/classname";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardIcon, ExitIcon } from "@radix-ui/react-icons";

import { forwardRef, ReactNode } from "react";

const AccountDropdown = ({ children }: { children: ReactNode }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="frosted-glass z-50 mr-4 rounded-md p-1"
          sideOffset={16}
        >
          <DropdownItem>
            <DashboardIcon className="h-4 w-4" />
            Dashboard
          </DropdownItem>
          <DropdownItem>
            <ExitIcon className="h-4 w-4" />
            Log Out
          </DropdownItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

type DropdownItemProps = {
  onSelect?: () => void;
  children: ReactNode;
};

const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ onSelect, children }, ref) => {
    return (
      <DropdownMenu.Item
        className={cn(
          "flex flex-row items-center justify-between gap-4",
          "text-md cursor-pointer rounded-sm p-2 leading-none hover:outline-none data-[highlighted]:bg-red-200 dark:data-[highlighted]:bg-violet-400",
        )}
        ref={ref}
        onSelect={onSelect}
      >
        {children}
      </DropdownMenu.Item>
    );
  },
);

export default AccountDropdown;
