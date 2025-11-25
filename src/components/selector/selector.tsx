import SelectorDrawer from "@/components/selector/drawer";
import Dropdown from "@/components/selector/dropdown";
import { SelectorProps } from "@/components/selector/type";
import useCheckMobile from "@/lib/hooks/use-check-mobile";
import { cn } from "@/lib/utils/classname";

export default function Selector<TValue extends string | number>({
  id,
  onChange,
  value,
  options,
  selectLabel,
  dialogTitle,
  dialogDescription,
  className,
}: SelectorProps<TValue>) {
  const isMobile = useCheckMobile();

  // converts the value to the format needed by CustomSelect (string or number)
  const handleValueChange = (selectedValue: string | number) => {
    onChange(selectedValue as TValue);
  };

  if (!isMobile) {
    return (
      <div className={className}>
        <Dropdown
          id={id}
          // The value must be passed as a string for CustomSelect to work with string-type values
          value={String(value)}
          options={options}
          onChange={handleValueChange}
          className={cn("w-full", !className && "h-fit w-fit")}
        />
      </div>
    );
  } else {
    return (
      <SelectorDrawer
        id={id}
        value={value}
        options={options}
        onChange={onChange}
        selectLabel={selectLabel}
        dialogTitle={dialogTitle}
        dialogDescription={dialogDescription}
      />
    );
  }
}
