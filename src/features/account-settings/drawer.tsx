import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils/classname";

export default function AccountSettingsDrawer({
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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div>{children}</div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40" />

        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="animate-slideUp data-[state=closed]:animate-slideDown h-7/8 fixed bottom-0 left-0 right-0 z-50 flex w-full flex-col p-4 outline-none"
          aria-label="Account Settings"
        >
          <div
            className={cn(
              "rounded-t-4xl absolute -bottom-12 left-0 right-0 top-0 -z-10 border-t shadow-lg",
              "frosted-glass",
            )}
          />

          <Dialog.Title className="sr-only">Account Settings</Dialog.Title>
          <Dialog.Description className="sr-only">
            Account settings drawer
          </Dialog.Description>

          <div className="flex flex-1 flex-col overflow-y-auto">{content}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
