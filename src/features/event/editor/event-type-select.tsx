import CustomSelect from "@/components/selector/dropdown";

type EventTypeSelectProps = {
  id: string;
  eventType: string;
  disabled?: boolean;
  onEventTypeChange: (type: "specific" | "weekday") => void;
};

export default function EventTypeSelect({
  id,
  eventType,
  disabled = false,
  onEventTypeChange,
}: EventTypeSelectProps) {
  return (
    <CustomSelect
      id={id}
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
