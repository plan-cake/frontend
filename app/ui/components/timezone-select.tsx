import { groupedTimezones } from "@/app/_lib/grouped-timezones";
import CustomSelect from "./custom-select";

type TimezoneSelectProps = {
  label?: string;
  value: string;
  onChange: (tz: string | number) => void;
};

export default function TimezoneSelect({
  label = "Event Timezone",
  value,
  onChange,
}: TimezoneSelectProps) {
  return (
    <div>
      <label
        htmlFor="timezone"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
      >
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
