"use client";

import { useState } from "react";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { Banner } from "@/components/banner";
import HeaderSpacer from "@/components/header-spacer";
import MobileFooterTray from "@/components/mobile-footer-tray";
import TextInputField from "@/components/text-input-field";
import { EventRange, SpecificDateRange } from "@/core/event/types";
import { useEventInfo } from "@/core/event/use-event-info";
import ActionButton from "@/features/button/components/action";
import LinkButton from "@/features/button/components/link";
import TimeZoneSelector from "@/features/event/components/timezone-selector";
import DateRangeSelector from "@/features/event/editor/date-range/selector";
import DurationSelector from "@/features/event/editor/duration-selector";
import TimeSelector from "@/features/event/editor/time-selector";
import { EventEditorType } from "@/features/event/editor/types";
import { validateEventData } from "@/features/event/editor/validate-data";
import GridPreviewDialog from "@/features/event/grid/preview-dialog";
import { useToast } from "@/features/toast/context";
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
    setTimezone,
    setDuration,
    setTimeRange,
    setDateRange,
    setWeekdayRange,
  } = useEventInfo(initialData);
  const { title, customCode, eventRange } = state;
  const router = useRouter();

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (e: string) => {
    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
    else if (e === "") {
      setErrors((prev) => ({ ...prev, title: "Please enter an event name." }));
    }
    setTitle(e);
  };

  const handleTimeRangeChange = (from: number, to: number) => {
    if (errors.timeRange) setErrors((prev) => ({ ...prev, timeRange: "" }));

    if (from >= to) {
      setErrors((prev) => ({
        ...prev,
        timeRange: "Please select a valid time range.",
      }));
    }

    setTimeRange({ from, to });
  };

  const handleCustomCodeChange = useDebouncedCallback((customCode: string) => {
    if (type === "edit") return;

    if (errors.customCode) setErrors((prev) => ({ ...prev, customCode: "" }));

    const checkCustomCodeAvailability = async () => {
      try {
        const response = await fetch("/api/event/check-code/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ custom_code: customCode }),
        });

        if (!response.ok) {
          setErrors((prev) => ({
            ...prev,
            customCode: "This code is unavailable. Please choose another.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, customCode: "" }));
        }
      } catch (error) {
        console.error("Error checking custom code availability:", error);
        addToast("error", "An unexpected error occurred. Please try again.");
      }
    };

    checkCustomCodeAvailability();
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
      addToast("error", "An unexpected error occurred. Please try again.");
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
        <Banner type="error" title="Woah! Slow down" className="mb-8 w-full">
          {errors.rate_limit}
        </Banner>
      )}

      <div className="-mb-1 flex w-full items-center justify-between">
        <div className="md:w-1/2">
          <TextInputField
            id={"event-name"}
            type="text"
            label="Enter Event Name"
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

      <div className="grid w-full grid-cols-1 gap-y-2 md:grow md:grid-cols-[200px_repeat(10,minmax(0,1fr))] md:grid-rows-[auto_repeat(15,minmax(0,1fr))] md:gap-x-4 md:gap-y-1">
        {/* Date range picker */}
        <div className="flex items-center md:col-span-10">
          <DateRangeSelector
            earliestDate={earliestCalendarDate}
            eventRange={eventRange}
            editing={type === "edit"}
            setEventType={setEventType}
            setWeekdayRange={setWeekdayRange}
            setDateRange={setDateRange}
          />
        </div>

        {/* From/To */}
        <label
          className={`flex items-center gap-2 md:col-start-1 md:row-start-2 ${errors.timeRange ? "text-error" : ""}`}
        >
          Possible Times
          {errors.timeRange && <ExclamationTriangleIcon className="h-4 w-4" />}
        </label>
        <div className="flex space-x-4 md:col-start-1 md:row-start-3">
          <label htmlFor="from-time-dropdown" className="text-gray-400">
            FROM
          </label>
          <TimeSelector
            id="from-time-dropdown"
            value={eventRange.timeRange.from}
            onChange={(value) =>
              handleTimeRangeChange(value, eventRange.timeRange.to)
            }
          />
        </div>
        <div className="flex space-x-4 md:col-start-1 md:row-start-4">
          <label htmlFor="to-time-dropdown" className="text-gray-400">
            UNTIL
          </label>
          <TimeSelector
            id="to-time-dropdown"
            value={eventRange.timeRange.to}
            onChange={(value) =>
              handleTimeRangeChange(eventRange.timeRange.from, value)
            }
          />
        </div>

        {/* Timezone & Duration */}
        <div className="md:contents">
          {/* Desktop: show all options */}
          <label className="hidden md:col-start-1 md:row-start-10 md:block">
            Advanced Options
          </label>
          <label
            htmlFor="timezone-select"
            className="hidden text-gray-400 md:col-start-1 md:row-start-11 md:block"
          >
            Timezone
          </label>
          <div className="hidden md:col-start-1 md:row-start-12 md:block">
            <TimeZoneSelector
              id="timezone-select"
              value={eventRange.timezone}
              onChange={setTimezone}
            />
          </div>
          <label
            htmlFor="duration-select"
            className="hidden text-gray-400 md:col-start-1 md:row-start-13 md:block"
          >
            Duration
          </label>
          <div className="md:row-start-14 hidden md:col-start-1 md:block">
            <DurationSelector
              id="duration-select"
              value={eventRange.duration}
              onChange={(v) => setDuration((v as number) || 0)}
            />
          </div>

          <label className="md:row-start-15 hidden text-gray-400 md:col-start-1 md:flex md:justify-between">
            {type === "new" && "Custom"} Event Code
            {errors.customCode && (
              <ExclamationTriangleIcon className="text-error h-4 w-4" />
            )}
          </label>
          <div className="md:row-start-16 hidden md:col-start-1 md:block">
            <input
              type="text"
              value={customCode}
              disabled={type === "edit"}
              onChange={(e) => {
                setCustomCode(e.target.value);
                handleCustomCodeChange(e.target.value);
              }}
              placeholder="optional"
              className={`border-b-1 w-full focus:outline-none ${
                errors.customCode
                  ? "border-error placeholder:text-error"
                  : "text-accent border-gray-400"
              }`}
            />
          </div>

          {/* Mobile: expandable section */}
          <details className="block md:hidden">
            <summary className="cursor-pointer rounded px-1 py-2 font-medium">
              Advanced Options
            </summary>
            <div className="mt-2 flex flex-col gap-1">
              <label htmlFor="timezone-select" className="text-gray-400">
                Timezone
              </label>
              <TimeZoneSelector
                id="timezone-select"
                value={eventRange.timezone}
                onChange={setTimezone}
              />
              <label htmlFor="duration-select" className="text-gray-400">
                Duration
              </label>
              <DurationSelector
                id="duration-select"
                value={eventRange.duration}
                onChange={(v) => setDuration((v as number) || 0)}
              />
              <label className="flex justify-between text-gray-400">
                {type === "new" && "Custom"} Event Code
                {errors.customCode && (
                  <ExclamationTriangleIcon className="text-error h-4 w-4" />
                )}
              </label>
              <input
                type="text"
                disabled={type === "edit"}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="optional"
                className={cn(
                  "border-b-1 w-full border-gray-400 focus:outline-none",
                  type === "new" && "text-accent",
                  type === "edit" && "cursor-not-allowed opacity-50",
                  errors.customCode
                    ? "border-error placeholder:text-error"
                    : "",
                )}
              />
            </div>
          </details>
        </div>

        <div className="md:row-span-15 hidden flex-1 md:col-span-10 md:col-start-2 md:row-start-2 md:block">
          <GridPreviewDialog eventRange={eventRange} />
        </div>
      </div>

      <div className="min-h-screen md:hidden">
        <GridPreviewDialog eventRange={eventRange} />
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
