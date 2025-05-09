import CustomSelect from "./custom-select";

type TimeDropdownProps = {
  onChange?: (time: Date) => void;
  value?: Date | null | undefined;
};

export default function TimeDropdown({ onChange, value }: TimeDropdownProps) {
  const options = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? "am" : "pm";
    return `${hour} ${period}`;
  });

  const handleValueChange = (selectedValue: string) => {
    const [hourStr, period] = selectedValue.split(" ");
    let hour = Number(hourStr);
    if (period === "pm" && hour !== 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;

    const selectedTime = new Date();
    selectedTime.setHours(hour, 0, 0, 0);
    onChange?.(selectedTime);
  };

  // Format current `value` to match an option like "2 pm"
  const formattedValue = (() => {
    if (!value) return "";
    const hour = value.getHours();
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 ? "am" : "pm";
    return `${displayHour} ${period}`;
  })();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CustomSelect
          options={options}
          value={formattedValue}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
}
