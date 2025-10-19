import CustomSelect from "@/app/ui/components/selectors/custom-select";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";

type TimezoneSelectProps = {
  id: string;
  value: string;
  onChange: (tz: string) => void;
  className?: string;
};

const labelStyle = "original";
const timezones = allTimezones;

export default function TimezoneSelect({
  id,
  value,
  className,
  onChange,
}: TimezoneSelectProps) {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  return (
    <div className={className}>
      <CustomSelect
        id={id}
        options={options}
        value={parseTimezone(value)?.value || ""}
        onValueChange={(v) => onChange(String(v))}
        className="w-full"
      />
    </div>
  );
}
