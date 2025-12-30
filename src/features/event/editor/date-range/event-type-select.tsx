import Dropdown from "@/features/selector/components/dropdown";

type EventTypeSelectProps = {
  id: string;
  eventType: string;
  onEventTypeChange: (type: "specific" | "weekday") => void;
  disabled?: boolean;
};

export default function EventTypeSelect({
  id,
  eventType,
  disabled = false,
  onEventTypeChange,
}: EventTypeSelectProps) {
  return (
    <Dropdown
      id={id}
      options={[
        { label: "Specific Dates", value: "specific" },
        { label: "Days of the Week", value: "weekday" },
      ]}
      value={eventType === "specific" ? "specific" : "weekday"}
      disabled={disabled}
      onChange={(value: string | number) =>
        onEventTypeChange?.(
          String(value) === "specific" ? "specific" : "weekday",
        )
      }
      className="min-h-9 w-fit min-w-[100px] border-none"
    />
  );
}
