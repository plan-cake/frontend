import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils/classname";
import useCheckMobile from "@/lib/hooks/use-check-mobile";
import CustomSelect from "@/components/select";

const labelStyle = "original";
const timezones = allTimezones;

type TimeZoneSelectorProps = {
  id: string;
  onChange: (tz: string) => void;
  value: string;
  className?: string;
};

export default function TimeZoneSelector({
  id,
  onChange,
  value,
  className,
}: TimeZoneSelectorProps) {
  const isMobile = useCheckMobile();

  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  if (!isMobile) {
    return (
      <div className={className}>
        <CustomSelect
          id={id}
          options={options}
          value={parseTimezone(value)?.value || ""}
          onValueChange={(v) => onChange(String(v))}
          className="w-full"
        />
      </div>
    );
  } else {
    return (
      <TimeZoneDrawer
        id={id}
        value={parseTimezone(value)?.value || ""}
        options={options}
        onChange={onChange}
      />
    );
  }
}

function TimeZoneDrawer({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (tz: string) => void;
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
          "text-blue dark:text-red inline-flex items-center rounded-md text-start focus:outline-none",
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
          <div className="rounded-t-4xl flex-1 justify-center overflow-y-auto bg-white p-8 shadow-lg dark:bg-violet">
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
                    "p-4",
                    isSelected && "bg-blue dark:bg-red rounded-full text-white",
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
