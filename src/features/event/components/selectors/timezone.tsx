import { useTimezoneSelect, allTimezones } from "react-timezone-select";

import Selector from "@/components/selector/selector";

const labelStyle = "original";
const timezones = allTimezones;

type TimeZoneSelectorProps = {
  id: string;
  onChange: (tz: string) => void;
  value: string;
  className?: string;
};

export default function TimeZoneSelector({
  id,
  onChange,
  value,
  className,
}: TimeZoneSelectorProps) {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });

  const parsedValue = parseTimezone(value)?.value || "";

  return (
    <Selector<string>
      id={id}
      onChange={onChange}
      value={parsedValue}
      options={options}
      dialogTitle="Select Timezone"
      dialogDescription="Select a timezone from the list"
      className={className}
    />
  );
}
