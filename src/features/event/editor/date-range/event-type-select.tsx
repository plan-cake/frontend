import { useEventContext } from "@/core/event/context";
import Dropdown from "@/features/selector/components/dropdown";

type EventType = "specific" | "weekday";

type EventTypeSelectProps = {
  id: string;
  disabled?: boolean;
};

export default function EventTypeSelect({
  id,
  disabled = false,
}: EventTypeSelectProps) {
  const { state, setEventType } = useEventContext();
  const rangeType = state.eventRange?.type || "specific";

  return (
    <Dropdown
      id={id}
      options={[
        { label: "Specific Dates", value: "specific" },
        { label: "Days of the Week", value: "weekday" },
      ]}
      value={rangeType}
      disabled={true}
      onChange={(value: EventType) => setEventType(value)}
      className="w-fit min-w-[100px] border-none"
    />
  );
}
