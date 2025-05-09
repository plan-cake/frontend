import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { forwardRef } from "react";
import { cn } from "@/app/_lib/utils";

type CustomSelectProps = {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export default function CustomSelect({
  options,
  value,
  onValueChange,
  className,
}: CustomSelectProps) {
  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={cn(
          "inline-flex items-center justify-between rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none dark:border-gray-400",
          className,
        )}
        aria-label="Custom select"
      >
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="z-50 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-400 dark:bg-dblue dark:shadow-dblue-1200">
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value }, ref) => {
    return (
      <Select.Item
        ref={ref}
        value={value}
        className="relative flex h-[30px] items-center rounded px-6 text-sm leading-none select-none hover:outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[highlighted]:bg-red-300 data-[highlighted]:text-red-900 dark:data-[highlighted]:bg-red-1000 dark:data-[highlighted]:text-white"
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
