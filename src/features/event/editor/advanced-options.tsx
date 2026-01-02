import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { useEventContext } from "@/core/event/context";
import DurationSelector from "@/features/event/components/selectors/duration";
import TimeZoneSelector from "@/features/event/components/selectors/timezone";
import FormSelectorField from "@/features/selector/components/selector-field";
import { cn } from "@/lib/utils/classname";

type AdvancedOptionsProps = {
  isEditing?: boolean;
  errors: Record<string, string>;

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
  isEditing = false,
  errors,
  handleCustomCodeChange,
}: AdvancedOptionsProps) {
  const {
    state: { customCode, eventRange },
    setTimezone,
    setDuration,
  } = useEventContext();

  return (
    <>
      <FormSelectorField label="Timezone" htmlFor="timezone-select" isVertical>
        <TimeZoneSelector
          id="timezone-select"
          value={eventRange.timezone}
          onChange={setTimezone}
        />
      </FormSelectorField>

      <FormSelectorField label="Duration" htmlFor="duration-select" isVertical>
        <DurationSelector
          id="duration-select"
          value={eventRange.duration}
          onChange={(v) => setDuration((v as number) || 0)}
        />
      </FormSelectorField>

      <label className="flex justify-between text-gray-400">
        {!isEditing && "Custom"} Event Code
        {errors.customCode && (
          <ExclamationTriangleIcon className="text-error h-4 w-4" />
        )}
      </label>
      <input
        type="text"
        value={customCode}
        onChange={handleCustomCodeChange}
        placeholder="optional"
        disabled={isEditing}
        className={cn(
          "border-b-1 w-full border-gray-400 focus:outline-none",
          !isEditing && "text-accent",
          isEditing && "cursor-not-allowed opacity-50",
          errors.customCode ? "border-error placeholder:text-error" : "",
        )}
      />
    </>
  );
}
