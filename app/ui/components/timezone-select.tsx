import { groupedTimezones } from "@/app/_lib/grouped-timezones";
import CustomGroupSelect from "./custom-group-select";

type TimezoneSelectProps = {
  label?: string;
  value: string;
  onChange: (tz: string) => void;
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
      <CustomGroupSelect
        groupedOptions={groupedTimezones}
        value={value}
        onValueChange={onChange}
        className="w-fit"
      />
    </div>
  );
}
