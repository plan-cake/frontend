import CustomSelect from "@/app/ui/components/custom-select";
import { time } from "console";

type TimeDropdownProps = {
  onChange: (time: number) => void;
  value: number;
  defaultTZ: string;
  duration: number;
};

export default function TimeDropdown({ onChange, value }: TimeDropdownProps) {
  const options = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "am" : "pm";
    return { label: `${hour}:00 ${period}`, value: i };
  });

  const handleValueChange = (selectedValue: string | number) => {
    const hour = Number(selectedValue);
    onChange(hour);
  };

  return (
    <CustomSelect
      options={options}
      value={value}
      onValueChange={handleValueChange}
      className="h-fit w-fit"
    />
  );
}
