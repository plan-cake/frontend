import * as Popover from "@radix-ui/react-popover";

import { cn } from "@/lib/utils/classname";

export default function AccountSettingsPopover({
  children,
  content,
  open,
  setOpen,
}: {
  children?: React.ReactNode;
  content: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>{children}</Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={20}
          onOpenAutoFocus={(e) => e.preventDefault()}
          side="bottom"
          className={cn(
            "w-100 z-50 rounded-3xl border border-gray-400 p-4 shadow-lg",
            "data-[state=open]:animate-slideUpAndFade",
            "frosted-glass",
          )}
          aria-label="Account settings"
        >
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
