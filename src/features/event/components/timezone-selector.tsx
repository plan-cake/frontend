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
  const valueLabel =
    options.find((opt) => opt.value === parsedValue)?.label || "";

  return (
    <Selector<string>
      id={id}
      onChange={onChange}
      value={parsedValue} // Use the parsed value for matching options
      options={options}
      selectLabel={valueLabel}
      dialogTitle="Select Timezone"
      dialogDescription="Select a timezone from the list"
      className={className} // Pass through the class for the main wrapper div
    />
  );
}
