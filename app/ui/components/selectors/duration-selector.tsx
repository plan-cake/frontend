import { useState, useEffect, useRef } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import useCheckMobile from "@/app/_lib/use-check-mobile";
import CustomSelect from "./custom-select";
import { cn } from "@/app/_lib/classname";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const durationOptions = [
  { label: "None", value: 0 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
];

type DurationSelectorProps = {
  id: string;
  onChange: (duration: string | number) => void;
  value: number;
};

export default function DurationSelector({
  id,
  onChange,
  value,
}: DurationSelectorProps) {
  const isMobile = useCheckMobile();

  if (!isMobile) {
    return (
      <CustomSelect
        id="duration-select"
        options={durationOptions}
        value={value}
        onValueChange={onChange}
      />
    );
  } else {
    return (
      <DurationDrawer
        id={id}
        value={value}
        options={durationOptions}
        onChange={onChange}
      />
    );
  }
}

function DurationDrawer({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: number;
  options: { label: string; value: number }[];
  onChange: (duration: number) => void;
}) {
  const valueLabel = options.find((opt) => opt.value === value)?.label || "";

  // 1. Add state to control the dialog
  const [open, setOpen] = useState(false);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  // 2. Change the effect to run when 'open' changes
  useEffect(() => {
    // Only run when the dialog *opens*
    if (open) {
      // 3. Use a timeout. This pushes the scroll command to the
      //    end of the event loop, AFTER the animation has finished.
      const timer = setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({
          block: "center", // You can also try "nearest"
          behavior: "auto",
        });
      }, 0); // 0ms is usually enough, but you can try 50ms or 100ms if 0 doesn't work

      return () => clearTimeout(timer);
    }
  }, [open]); // --- Dependency array is now [open] ---

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        asChild
        id={id}
        className={cn(
          "inline-flex items-center rounded-md text-start text-blue focus:outline-none dark:text-red",
        )}
        aria-label="Select time"
      >
        <div>
          <span className="flex-1 truncate pr-2">{valueLabel}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-gray-700/40" />
        <Dialog.Content
          className="fixed right-0 bottom-0 left-0 z-50 flex h-[500px] w-full animate-slideUp flex-col focus:outline-none data-[state=closed]:animate-slideDown"
          aria-label="Date range picker"
        >
          <div className="flex-1 justify-center overflow-y-auto rounded-t-4xl bg-white p-8 shadow-lg dark:bg-violet">
            <div
              aria-hidden
              className="sticky mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300"
            />
            <Dialog.Title className="mb-2 flex flex-row items-center justify-between text-lg font-semibold">
              Select Time
            </Dialog.Title>

            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  ref={isSelected ? selectedItemRef : null}
                  key={option.value.toString()}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "p-4 text-center",
                    isSelected && "rounded-full bg-blue text-white dark:bg-red",
                  )}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
