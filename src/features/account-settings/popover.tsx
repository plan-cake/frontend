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
          className={cn(
            "w-sm z-50 rounded-3xl border border-gray-400 p-4 shadow-lg",
            "data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade",
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
