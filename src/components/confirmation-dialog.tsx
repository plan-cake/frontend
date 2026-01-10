import { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ExclamationTriangleIcon,
  CheckIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

import ActionButton from "@/features/button/components/action";
import { cn } from "@/lib/utils/classname";

type ConfirmationDialogProps = {
  title: string;
  description: string;
  onConfirm: () => boolean | Promise<boolean>;
  children: React.ReactNode;
  disabled?: boolean;
};

type ConfirmationDialogTypes = "warning" | "delete" | "sucess" | "info";

function getDialogIcon(iconType: ConfirmationDialogTypes) {
  const iconClass = "h-10 w-10";
  const iconWrapperClass = "rounded-full p-4";

  switch (iconType) {
    case "warning":
      return (
        <div className={cn("bg-lion aspect-square rounded-full text-center")}>
          <div className="text-[48px]">!</div>
        </div>
      );
    case "delete":
      return (
        <div className={cn(iconWrapperClass, "bg-error/40")}>
          <ExclamationTriangleIcon className={iconClass} />
        </div>
      );
    case "sucess":
      return (
        <div className={cn(iconWrapperClass, "bg-foreground/40")}>
          <CheckIcon className={iconClass} />
        </div>
      );
    default:
      return (
        <div className={cn(iconWrapperClass, "bg-blue/40")}>
          <InfoCircledIcon className={iconClass} />
        </div>
      );
  }
}

export default function ConfirmationDialog({
  title,
  description,
  onConfirm,
  children: triggerElement,
  disabled = false,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    return true;
  };

  const handleConfirm = async () => {
    const success = await onConfirm();
    if (success) {
      setOpen(false);
    }
    return success;
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        asChild
        disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        aria-disabled={disabled}
      >
        {triggerElement}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content className="bg-panel data-[state=open]:animate-contentShow fixed left-1/2 top-1/2 z-40 max-h-[85vh] w-[75vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-3xl p-[25px] shadow-[var(--shadow-6)] focus:outline-none md:w-[25vw]">
          <Dialog.Title className="flex flex-col items-center gap-4">
            {/* {getDialogIcon("delete")} */}
            <p className="text-lg font-bold">{title}</p>
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-center">
            {description}
          </Dialog.Description>

          <div className="mt-[25px] flex justify-center gap-4">
            <ActionButton
              buttonStyle="transparent"
              label="Cancel"
              onClick={handleClose}
            />
            <ActionButton
              buttonStyle="primary"
              label="Confirm"
              onClick={handleConfirm}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
