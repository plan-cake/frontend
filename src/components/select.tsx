import { forwardRef } from "react";

import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

import { cn } from "@/lib/utils/classname";

// --- Simplified Types ---
type Option = {
  label: string;
  value: string | number;
};

type CustomSelectProps = {
  id: string;
  value: string | number;
  options: Option[];
  disabled?: boolean;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
};

// --- Refactored Component ---
export default function CustomSelect({
  id,
  value,
  options,
  disabled,
  onValueChange,
  placeholder,
  className,
}: CustomSelectProps) {
  return (
    <Select.Root
      value={value?.toString()}
      onValueChange={(v) => onValueChange(isNaN(Number(v)) ? v : Number(v))}
    >
      <Select.Trigger
        id={id}
        className={cn(
          "text-blue dark:text-red inline-flex items-center rounded-md text-start focus:outline-none",
          disabled && "text-violet/50 cursor-not-allowed dark:text-white/50",
          className,
        )}
        aria-label="Custom select"
        disabled={disabled}
      >
        <span className="flex-1 truncate pr-2">
          <Select.Value placeholder={placeholder} />
        </span>
        {disabled ? null : (
          <Select.Icon className="flex-shrink-0">
            <ChevronDownIcon className="h-4 w-4" />
          </Select.Icon>
        )}
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="dark:shadow-violet-700 z-50 max-h-60 overflow-auto rounded-md border border-gray-400 bg-white shadow-lg dark:bg-violet">
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <SelectItem key={option.value.toString()} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// --- SelectItem (Unchanged) ---
type SelectItemProps = {
  value: string | number;
  children: React.ReactNode;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value }, ref) => {
    return (
      <Select.Item
        ref={ref}
        value={value.toString()}
        className="data-[highlighted]:bg-blue dark:data-[highlighted]:bg-red relative flex h-[30px] select-none items-center rounded px-6 leading-none hover:outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[highlighted]:text-white dark:data-[highlighted]:text-bone"
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 inline-flex w-4 items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";
