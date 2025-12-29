import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import DurationSelector from "@/features/event/components/selectors/duration";
import TimeZoneSelector from "@/features/event/components/selectors/timezone";
import { EventEditorType } from "@/features/event/editor/types";
import FormSelectorField from "@/features/selector/components/selector-field";
import { cn } from "@/lib/utils/classname";

type AdvancedOptionsProps = {
  type: EventEditorType;
  errors: Record<string, string>;

  // handlers and state
  timezone: string;
  duration: number;
  customCode: string;
  setTimezone: (tz: string) => void;
  setDuration: (val: number) => void;
  handleCustomCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AdvancedOptions(props: AdvancedOptionsProps) {
  return (
    <>
      {/* Mobile: collapsible */}
      <details className="block md:hidden">
        <summary className="cursor-pointer rounded px-1 py-2 font-medium">
          Advanced Options
        </summary>
        <div className="mx-4 mb-4 flex flex-col gap-1">
          <Options {...props} />
        </div>
      </details>

      {/* Desktop: always visible (not collapsible) */}
      <div className="hidden md:block">
        <div className="font-medium">Advanced Options</div>
        <div className="mt-2 flex flex-col gap-1">
          <Options {...props} />
        </div>
      </div>
    </>
  );
}

function Options({
  type,
  errors,
  timezone,
  duration,
  customCode,
  setTimezone,
  setDuration,
  handleCustomCodeChange,
}: AdvancedOptionsProps) {
  return (
    <>
      <FormSelectorField label="Timezone" htmlFor="timezone-select" isVertical>
        <TimeZoneSelector
          id="timezone-select"
          value={timezone}
          onChange={setTimezone}
        />
      </FormSelectorField>

      <FormSelectorField label="Duration" htmlFor="duration-select" isVertical>
        <DurationSelector
          id="duration-select"
          value={duration}
          onChange={(v) => setDuration((v as number) || 0)}
        />
      </FormSelectorField>

      <label className="flex justify-between text-gray-400">
        {type === "new" && "Custom"} Event Code
        {errors.customCode && (
          <ExclamationTriangleIcon className="text-error h-4 w-4" />
        )}
      </label>
      <input
        type="text"
        value={customCode}
        onChange={handleCustomCodeChange}
        placeholder="optional"
        disabled={type === "edit"}
        className={cn(
          "border-b-1 w-full border-gray-400 focus:outline-none",
          type === "new" && "text-accent",
          type === "edit" && "cursor-not-allowed opacity-50",
          errors.customCode ? "border-error placeholder:text-error" : "",
        )}
      />
    </>
  );
}
