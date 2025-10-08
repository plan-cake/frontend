import CustomSelect from "./custom-select";

type EventTypeSelectProps = {
  eventType: string;
  onEventTypeChange: (type: "specific" | "weekday") => void;
};

export default function EventTypeSelect({
  eventType,
  onEventTypeChange,
}: EventTypeSelectProps) {
  return (
    <CustomSelect
      options={[
        { label: "Specific Dates", value: "specific" },
        { label: "Days of the Week", value: "weekday" },
      ]}
      value={eventType === "specific" ? "specific" : "weekday"}
      onValueChange={(value) =>
        onEventTypeChange?.(value === "specific" ? "specific" : "weekday")
      }
      className="min-h-9 min-w-[100px] border-none pt-2"
    />
  );
}
