import { groupedTimezones } from "@/app/_lib/grouped-timezones";
import CustomSelect from "./custom-select";

type TimezoneSelectProps = {
  label?: string;
  value: string;
  onChange: (tz: string | number) => void;
  className?: string;
};

export default function TimezoneSelect({
  label = "Event Timezone",
  value,
  onChange,
  className,
}: TimezoneSelectProps) {
  return (
    <div className={className}>
      <label htmlFor="timezone" className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <CustomSelect
        options={groupedTimezones}
        isGrouped
        value={value}
        onValueChange={onChange}
        className="w-fit"
      />
    </div>
  );
}
