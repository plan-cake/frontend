import { useState, useEffect, useRef } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

import { SelectorProps } from "@/components/selector/type";
import ActionButton from "@/features/button/components/action";
import { cn } from "@/lib/utils/classname";

export default function SelectorDrawer<TValue extends string | number>({
  id,
  value,
  options,
  onChange,
  dialogTitle,
  dialogDescription,
}: SelectorProps<TValue>) {
  const [open, setOpen] = useState(false);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  const selectLabel = options.find((opt) => opt.value === value)?.label || "";

  const handleClose = () => {
    setOpen(false);
    return true;
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        // Scroll the selected item into view when the drawer opens
        selectedItemRef.current?.scrollIntoView({
          block: "center",
          behavior: "auto",
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        id={id}
        className={cn(
          "inline-flex items-center rounded-full text-start focus:outline-none",
          "bg-loading text-accent px-3 py-1",
        )}
        aria-label={`Select ${dialogTitle}`}
      >
        <span className="text-wrap">{selectLabel}</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="animate-slideUp data-[state=closed]:animate-slideDown fixed bottom-0 left-0 right-0 z-50 flex h-[500px] w-full flex-col focus:outline-none"
          aria-label={dialogTitle}
          aria-describedby={dialogDescription}
        >
          <div className="rounded-t-4xl bg-background flex flex-1 flex-col overflow-y-auto shadow-lg">
            <div
              onPointerDown={handleClose}
              className="bg-background sticky top-0 z-10 flex items-center gap-4 p-8 pb-4"
            >
              <ActionButton
                buttonStyle="frosted glass"
                icon={<Cross1Icon />}
                label="Close Drawer"
                shrinkOnMobile
                onClick={handleClose}
              />

              <Dialog.Title className="mb-0 flex flex-row items-center justify-between text-lg font-semibold">
                {dialogTitle}
              </Dialog.Title>
            </div>

            <div className="flex-1 px-8 pb-8">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    ref={isSelected ? selectedItemRef : null}
                    key={String(option.value)}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer p-4 text-center",
                      isSelected && "bg-accent rounded-full text-white",
                      typeof option.value === "string" && "text-start",
                    )}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
