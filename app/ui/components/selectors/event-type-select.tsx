import CustomSelect from "./custom-select";

type EventTypeSelectProps = {
  eventType: string;
  disabled?: boolean;
  onEventTypeChange: (type: "specific" | "weekday") => void;
};

export default function EventTypeSelect({
  eventType,
  disabled = false,
  onEventTypeChange,
}: EventTypeSelectProps) {
  return (
    <CustomSelect
      options={[
        { label: "Specific Dates", value: "specific" },
        { label: "Days of the Week", value: "weekday" },
      ]}
      value={eventType === "specific" ? "specific" : "weekday"}
      disabled={disabled}
      onValueChange={(value) =>
        onEventTypeChange?.(value === "specific" ? "specific" : "weekday")
      }
      className="min-h-9 min-w-[100px] border-none"
    />
  );
}
