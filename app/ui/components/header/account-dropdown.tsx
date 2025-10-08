import { cn } from "@/app/_lib/classname";
import formatApiError from "@/app/_utils/format-api-error";
import { LoginContext } from "@/app/_lib/providers";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DashboardIcon, ExitIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { forwardRef, ReactNode, useContext, useRef } from "react";

const AccountDropdown = ({ children }: { children: ReactNode }) => {
  const isSubmitting = useRef(false);
  const { setLoggedIn } = useContext(LoginContext);
  const router = useRouter();

  const logout = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    await fetch("/api/auth/logout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          setLoggedIn(false);
          router.push("/login");
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("An error occurred. Please try again.");
      });

    isSubmitting.current = false;
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="frosted-glass z-50 mr-4 rounded-md p-1"
          sideOffset={16}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownItem onSelect={() => router.push("/dashboard")}>
            <DashboardIcon className="h-4 w-4" />
            Dashboard
          </DropdownItem>
          <DropdownItem onSelect={logout}>
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
