import { forwardRef } from "react";

import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/app/_lib/classname";

type Option = { label: string; value: string | number };
type GroupedOption = { label: string; options: Option[] };

type CustomSelectOptions = Option | GroupedOption;

type CustomSelectProps = {
  value: string | number;
  options: CustomSelectOptions[];
  isGrouped?: boolean;
  onValueChange: (value: string | number) => void;
  className?: string;
};

export default function CustomSelect({
  value,
  options,
  isGrouped = false,
  onValueChange,
  className,
}: CustomSelectProps) {
  // flatten options if they are grouped and find the current selected option
  const allOptions = isGrouped
    ? (options as GroupedOption[]).flatMap((g) => g.options)
    : (options as Option[]);
  const current = allOptions.find((o) => o.value === value);

  return (
    <Select.Root
      value={value.toString()}
      onValueChange={(v) => onValueChange(isNaN(Number(v)) ? v : Number(v))}
    >
      <Select.Trigger
        className={cn(
          "inline-flex items-center justify-between rounded-md text-blue focus:outline-none dark:text-red",
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
        <Select.Content className="z-50 max-h-60 overflow-auto rounded-md border border-gray-400 bg-white shadow-lg dark:bg-violet dark:shadow-violet-700">
          <Select.Viewport className="p-1">
            {isGrouped
              ? (options as GroupedOption[]).map((group) => (
                  <SelectGroup key={group.label} value={group.label}>
                    {group.options.map((option) => (
                      <SelectItem
                        key={`${group.label}-${option.value}`}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              : (options as Option[]).map((option) => (
                  <SelectItem
                    key={option.value.toString()}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

type SelectProps = {
  value: string | number;
  children: React.ReactNode;
};

const SelectItem = forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value }, ref) => {
    return (
      <Select.Item
        ref={ref}
        value={value.toString()}
        className="relative flex h-[30px] items-center rounded px-6 leading-none select-none hover:outline-none data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[highlighted]:bg-blue data-[highlighted]:text-white dark:data-[highlighted]:bg-red dark:data-[highlighted]:text-bone"
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

const SelectGroup = forwardRef<HTMLDivElement, SelectProps>(
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
