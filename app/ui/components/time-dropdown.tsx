import { fromZonedTime } from "date-fns-tz";
import CustomSelect from "@/app/ui/components/custom-select";

type TimeDropdownProps = {
  onChange: (time: Date) => void;
  value: string;
  defaultTZ: string;
  duration: number;
};

export default function TimeDropdown({
  onChange,
  value,
  defaultTZ,
}: TimeDropdownProps) {
  const options = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "am" : "pm";
    return { label: `${hour}:00 ${period}`, value: i };
  });

  const handleValueChange = (selectedValue: string | number) => {
    const hour = Number(selectedValue);

    const zonedSelectedTime = new Date();
    zonedSelectedTime.setHours(hour, 0, 0, 0);
    onChange(fromZonedTime(zonedSelectedTime, defaultTZ));
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
