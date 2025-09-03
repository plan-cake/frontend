import { groupedTimezones } from "@/app/_lib/grouped-timezones";
import CustomSelect from "@/app/ui/components/custom-select";

type TimezoneSelectProps = {
  value: string;
  onChange: (tz: string | number) => void;
  className?: string;
};

export default function TimezoneSelect({
  value,
  onChange,
  className,
}: TimezoneSelectProps) {
  return (
    <div className={className}>
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
