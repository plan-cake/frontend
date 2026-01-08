import { useEventContext } from "@/core/event/context";
import TimePicker from "@/features/event/editor/time-range/time-picker";
import FormSelectorField from "@/features/selector/components/selector-field";
import { cn } from "@/lib/utils/classname";

export default function TimeRangeSelection({}) {
  const { state, setStartTime, setEndTime } = useEventContext();
  const { from: startTime, to: endTime } = state.eventRange.timeRange;

  return (
    <div className="contents">
      <FormSelectorField label="FROM" htmlFor="start-time">
        <input
          id="start-time"
          value={startTime}
          className={cn(
            "inline-flex items-center rounded-full text-start",
            "bg-accent/15 hover:bg-accent/25 active:bg-accent/40 text-accent px-3 py-1",
            "hover:cursor-pointer focus:outline-none",
          )}
        />
      </FormSelectorField>
      <TimePicker time={startTime} onTimeChange={setStartTime} />
      <FormSelectorField label="UNTIL" htmlFor="end-time">
        <input
          id="end-time"
          value={endTime}
          className={cn(
            "inline-flex items-center rounded-full text-start",
            "bg-accent/15 hover:bg-accent/25 active:bg-accent/40 text-accent px-3 py-1",
            "hover:cursor-pointer focus:outline-none",
          )}
        />
      </FormSelectorField>
      <TimePicker time={endTime} onTimeChange={setEndTime} />
    </div>
  );
}
