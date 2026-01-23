import React, { useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import ActionButton from "@/features/button/components/action";
import { DIALOG_CONFIG } from "@/features/system-feedback/confirmation/config";
import { ConfirmationDialogType } from "@/features/system-feedback/type";
import { cn } from "@/lib/utils/classname";

type ConfirmationDialogProps = {
  type: ConfirmationDialogType;
  title: string;
  description: React.ReactNode;
  onConfirm: () => boolean | Promise<boolean>;
  children: React.ReactNode;
  disabled?: boolean;
  showIcon?: boolean;
};

export default function ConfirmationDialog({
  type,
  title,
  description,
  onConfirm,
  children: triggerElement,
  disabled = false,
  showIcon = false,
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

  const config = DIALOG_CONFIG[type] || DIALOG_CONFIG.info;
  const Icon = config.icon;

  const renderIcon = () => {
    if (config.isTextIcon) {
      return (
        <div
          className={cn(
            "aspect-square rounded-full text-center",
            config.bgClass,
          )}
        >
          <div className="text-[48px]">!</div>
        </div>
      );
    }
    return (
      <div className={cn("rounded-full p-4", config.bgClass)}>
        {Icon && <Icon className="h-10 w-10" />}
      </div>
    );
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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2",
            "bg-panel rounded-3xl p-6 shadow-md focus:outline-none",
            "max-w-3xl",
          )}
        >
          <Dialog.Title className="flex flex-col items-center gap-4">
            {showIcon && renderIcon()}
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
              buttonStyle={config.btnStyle}
              label="Confirm"
              onClick={handleConfirm}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
