"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import RateLimitBanner from "@/components/banner/rate-limit";
import HeaderSpacer from "@/components/header-spacer";
import MobileFooterTray from "@/components/mobile-footer-tray";
import SegmentedControl from "@/components/segmented-control";
import { EventRange, SpecificDateRange } from "@/core/event/types";
import { useEventInfo } from "@/core/event/use-event-info";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import TimeSelector from "@/features/event/components/selectors/time";
import AdvancedOptions from "@/features/event/editor/advanced-options";
import DateRangeSelection from "@/features/event/editor/date-range/selector";
import { EventEditorType } from "@/features/event/editor/types";
import { validateEventData } from "@/features/event/editor/validate-data";
import ScheduleGrid from "@/features/event/grid/grid";
import GridPreviewDialog from "@/features/event/grid/preview-dialog";
import FormSelectorField from "@/features/selector/components/selector-field";
import { useToast } from "@/features/toast/context";
import { MESSAGES } from "@/lib/messages";
import submitEvent from "@/lib/utils/api/submit-event";
import { cn } from "@/lib/utils/classname";

type EventEditorProps = {
  type: EventEditorType;
  initialData?: {
    title: string;
    code: string;
    eventRange: EventRange;
  };
};

export default function EventEditor({ type, initialData }: EventEditorProps) {
  const {
    state,
    setTitle,
    setEventType,
    setCustomCode,
    setStartTime,
    setEndTime,
    setDateRange,
    setWeekdayRange,
    setTimezone,
    setDuration,
  } = useEventInfo(initialData);
  const { title, customCode, eventRange } = state;
  const router = useRouter();

  const [mobileTab, setMobileTab] = useState<"details" | "preview">("details");

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (e: string) => {
    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
    else if (e === "") {
      setErrors((prev) => ({
        ...prev,
        title: MESSAGES.ERROR_EVENT_NAME_MISSING,
      }));
    }
    setTitle(e);
  };

  const handleTimeRangeChange = (from: number, to: number) => {
    if (errors.timeRange) setErrors((prev) => ({ ...prev, timeRange: "" }));

    if (from >= to) {
      setErrors((prev) => ({
        ...prev,
        timeRange: MESSAGES.ERROR_EVENT_RANGE_INVALID,
      }));
    }

    setTimeRange({ from, to });
  };

  const handleCustomCodeChange = useDebouncedCallback(async (customCode) => {
    if (type === "edit") return;

    if (errors.customCode) setErrors((prev) => ({ ...prev, customCode: "" }));
    if (customCode === "") {
      return;
    }

    try {
      const response = await fetch("/api/event/check-code/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_code: customCode }),
      });

      if (!response.ok) {
        setErrors((prev) => ({
          ...prev,
          customCode: MESSAGES.ERROR_EVENT_CODE_TAKEN,
        }));
      } else {
        setErrors((prev) => ({ ...prev, customCode: "" }));
      }
    } catch (error) {
      console.error("Error checking custom code availability:", error);
      addToast("error", MESSAGES.ERROR_GENERIC);
    }
  }, 300);

  // SUBMIT EVENT INFO
  const submitEventInfo = async () => {
    setErrors({}); // reset errors

    try {
      const validationErrors = await validateEventData(type, state);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        Object.values(validationErrors).forEach((error) =>
          addToast("error", error),
        );
        return false;
      }

      const success = await submitEvent(
        { title, code: customCode, eventRange },
        type,
        eventRange.type,
        (code: string) => router.push(`/${code}`),
        addToast,
        setErrors,
      );
      return success;
    } catch (error) {
      console.error("Submission failed:", error);
      addToast("error", MESSAGES.ERROR_GENERIC);
      return false;
    }
  };

  // BUTTONS
  const cancelButton = (
    <LinkButton
      buttonStyle="transparent"
      label="Cancel Edits"
      href={`/${initialData?.code}`}
    />
  );
  const submitButton = (
    <ActionButton
      buttonStyle="primary"
      label={type === "edit" ? "Update Event" : "Create Event"}
      onClick={submitEventInfo}
      loadOnSuccess
    />
  );

  const earliestCalendarDate = new Date(
    (initialData?.eventRange as SpecificDateRange)?.dateRange?.from,
  );

  return (
    <div className="flex min-h-dvh flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />

      {/* Rate Limit Error */}
      {errors.rate_limit && (
        <RateLimitBanner>{errors.rate_limit}</RateLimitBanner>
      )}

      <div className="-mb-1 flex w-full items-center justify-between">
        <div className="md:w-1/2">
          <TextInputField
            id={"event-name"}
            type="text"
            label="Event Name"
            value={title}
            onChange={handleNameChange}
            error={errors.title || errors.api}
            classname="text-2xl font-semibold"
          />
        </div>
        <div className="hidden gap-2 md:flex">
          {type === "edit" && cancelButton}
          {submitButton}
        </div>
      </div>

      <div className="md:hidden">
        <SegmentedControl
          value={mobileTab}
          onChange={setMobileTab}
          options={[
            { label: "Event Details", value: "details" },
            { label: "Grid Preview", value: "preview" },
          ]}
        />
      </div>

      <div
        className={cn(
          "w-full grid-cols-1 gap-y-2",
          mobileTab === "preview" ? "hidden md:grid" : "grid",
          "md:grow md:grid-cols-[200px_repeat(10,minmax(0,1fr))] md:grid-rows-[auto_repeat(15,minmax(0,1fr))] md:gap-x-4 md:gap-y-1",
        )}
      >
        <div className="flex items-center md:col-span-10">
          <DateRangeSelection
            earliestDate={earliestCalendarDate}
            eventRange={eventRange}
            editing={type === "edit"}
            setEventType={setEventType}
            setWeekdayRange={setWeekdayRange}
            setDateRange={setDateRange}
          />
        </div>

        <label className="md:col-start-1 md:row-start-2"> Possible Times</label>
        <div className="md:col-start-1 md:row-start-3">
          <FormSelectorField label="FROM" htmlFor="from-time-dropdown">
            <TimeSelector
              id="from-time-dropdown"
              value={eventRange.timeRange.from}
              onChange={setStartTime}
            />
          </FormSelectorField>
        </div>
        <div className="md:col-start-1 md:row-start-4">
          <FormSelectorField label="UNTIL" htmlFor="to-time-dropdown">
            <TimeSelector
              id="to-time-dropdown"
              value={eventRange.timeRange.to}
              onChange={setEndTime}
            />
          </FormSelectorField>
        </div>

        <div className="md:content md:col-start-1 md:row-span-7 md:row-start-9 md:flex md:items-end">
          <AdvancedOptions
            type={type}
            errors={errors}
            timezone={eventRange.timezone}
            duration={eventRange.duration}
            customCode={customCode}
            setTimezone={setTimezone}
            setDuration={setDuration}
            handleCustomCodeChange={handleCustomCodeChange}
          />
        </div>

        <div className="h-16 md:hidden" />

        <div className="md:row-span-15 hidden flex-1 md:col-span-10 md:col-start-2 md:row-start-2 md:block">
          <GridPreviewDialog eventRange={eventRange} />
        </div>
      </div>

      <div
        className={cn(
          "bg-panel min-h-screen rounded-3xl p-4 md:hidden",
          mobileTab === "details" ? "hidden" : "block",
        )}
      >
        <ScheduleGrid
          mode="preview"
          eventRange={eventRange}
          disableSelect={true}
          timezone={eventRange.timezone}
        />
        <div className="h-16" />
      </div>

      <MobileFooterTray
        buttons={
          type === "edit" ? [cancelButton, submitButton] : [submitButton]
        }
      />
    </div>
  );
}
