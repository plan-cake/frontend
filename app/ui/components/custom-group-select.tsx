import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/app/_lib/classname";
import { forwardRef } from "react";

type Option = { label: string; value: string };
type GroupedOption = { label: string; options: Option[] };

type CustomSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  groupedOptions?: GroupedOption[];
  className?: string;
};

export default function CustomGroupSelect({
  groupedOptions,
  value,
  onValueChange,
  className,
}: CustomSelectProps) {
  const allOptions = groupedOptions?.flatMap((g) => g.options) ?? [];
  const current = allOptions.find((o) => o.value === value);

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        className={cn(
          "inline-flex items-center justify-between rounded-md border border-gray-400 px-4 py-2 text-sm focus:outline-none",
          className,
        )}
        aria-label="Custom select"
      >
        <Select.Value>{current?.label || "Select"}</Select.Value>
        <Select.Icon>
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="z-50 max-h-60 overflow-auto rounded-md border border-gray-400 bg-white shadow-lg dark:bg-violet dark:shadow-violet-700">
          <Select.Viewport className="p-1">
            {groupedOptions?.map((group) => (
              <SelectGroup key={group.label} value={group.label}>
                {group.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
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
        className="relative flex h-[30px] items-center rounded px-6 text-sm leading-none select-none hover:outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[highlighted]:bg-red-300 data-[highlighted]:text-red-900 dark:data-[highlighted]:bg-red-100 dark:data-[highlighted]:text-white"
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

const SelectGroup = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value }, ref) => {
    return (
      <Select.Group ref={ref}>
        <Select.Label className="px-[25px] text-xs leading-[25px] font-bold">
          {value}
        </Select.Label>
        {children}
        <Select.Separator className="m-[5px] h-px bg-violet dark:bg-white" />
      </Select.Group>
    );
  },
);
SelectGroup.displayName = "SelectGroup";
