import { useState, useEffect, useRef } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import CustomSelect from "@/components/select";
import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { cn } from "@/lib/utils/classname";

type TimeSelectorProps = {
  id: string;
  onChange: (time: number) => void;
  value: number;
};

export default function TimeSelector({
  id,
  onChange,
  value,
}: TimeSelectorProps) {
  const isMobile = useCheckMobile();

  const options = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "am" : "pm";
    return { label: `${hour}:00 ${period}`, value: i };
  });

  options.push({ label: "12:00 am", value: 24 });

  const handleValueChange = (selectedValue: string | number) => {
    const hour = Number(selectedValue);
    onChange(hour);
  };

  if (!isMobile) {
    return (
      <CustomSelect
        id={id}
        options={options}
        value={value}
        onValueChange={handleValueChange}
        className="h-fit w-fit"
      />
    );
  } else {
    return (
      <TimeDrawer id={id} value={value} options={options} onChange={onChange} />
    );
  }
}

function TimeDrawer({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: number;
  options: { label: string; value: number }[];
  onChange: (time: number) => void;
}) {
  const valueLabel = options.find((opt) => opt.value === value)?.label || "";

  const [open, setOpen] = useState(false);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
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
        asChild
        id={id}
        className={cn(
          "text-accent inline-flex items-center rounded-md text-start focus:outline-none",
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
          className="animate-slideUp data-[state=closed]:animate-slideDown fixed bottom-0 left-0 right-0 z-50 flex h-[500px] w-full flex-col focus:outline-none"
          aria-label="Date range picker"
        >
          <div className="rounded-t-4xl bg-background flex-1 justify-center overflow-y-auto p-8 shadow-lg">
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
                    isSelected && "bg-accent rounded-full text-white",
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
