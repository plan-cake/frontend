"use client";

import TimeSelector from "../components/selectors/time-selector";
import TimeZoneSelector from "../components/selectors/timezone-selector";
import DateRangeSelector from "@/app/ui/components/date-range/date-range-selector";
import DurationSelector from "../components/selectors/duration-selector";
import GridPreviewDialog from "@/app/ui/components/schedule/grid-preview-dialog";
import { useEventInfo } from "../../_lib/schedule/use-event-info";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import submitEvent from "@/app/_utils/submit-event";
import { cn } from "@/app/_lib/classname";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useToast } from "@/app/_lib/toast-context";
import { validateEventData } from "@/app/_utils/validate-data";
import { EventRange, SpecificDateRange } from "@/app/_lib/schedule/types";
import HeaderSpacer from "../components/header/header-spacer";

export type EventEditorType = "new" | "edit";

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
  const isSubmitting = useRef(false);
  const router = useRouter();

  // TOASTS AND ERROR STATES
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createErrorToast = (message: string) => {
    addToast({
      type: "error",
      id: Date.now() + Math.random(),
      title: "ERROR",
      message: message,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
    else if (e.target.value === "") {
      setErrors((prev) => ({ ...prev, title: "Please enter an event name." }));
    }
    setTitle(e.target.value);
  };

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.customCode) setErrors((prev) => ({ ...prev, customCode: "" }));
    setCustomCode(e.target.value);
  };

  // SUBMIT EVENT INFO
  const submitEventInfo = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setErrors({}); // reset errors

    try {
      const validationErrors = await validateEventData(type, state);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        Object.values(validationErrors).forEach(createErrorToast);
        return;
      }

      await submitEvent(
        { title, code: customCode, eventRange },
        type,
        eventRange.type,
        (code: string) => router.push(`/${code}`),
      );
    } catch (error) {
      console.error("Submission failed:", error);
      createErrorToast("An unexpected error occurred. Please try again.");
    } finally {
      isSubmitting.current = false;
    }
  };

  const earliestCalendarDate = new Date(
    (initialData?.eventRange as SpecificDateRange)?.dateRange?.from,
  );

  return (
    <div className="flex min-h-dvh flex-col space-y-4 pr-6 pl-6">
      <HeaderSpacer />
      <div className="flex w-full items-center justify-between">
        <div className="md:w-1/2">
          <p
            className={`text-right text-xs text-red ${errors.title ? "visible" : "invisible"}`}
          >
            {errors.title ? errors.title : "Error Placeholder"}
          </p>
          <input
            type="text"
            value={title}
            onChange={handleNameChange}
            placeholder="add event name"
            className={cn(
              "w-full border-b-1 p-1 text-2xl focus:outline-none",
              errors.title
                ? "border-red placeholder:text-red"
                : "border-violet dark:border-gray-400",
            )}
          />
        </div>
        <button
          className="hidden rounded-full border-2 border-blue bg-blue px-4 py-2 text-sm text-white transition-shadow hover:cursor-pointer hover:bg-blue-100 hover:text-violet md:flex dark:border-red dark:bg-red dark:hover:bg-red/25 dark:hover:text-white"
          onClick={submitEventInfo}
        >
          {type === "edit" ? "Update Event" : "Create Event"}
        </button>
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
        <label className="md:col-start-1 md:row-start-2"> Possible Times</label>
        <div className="flex space-x-4 md:col-start-1 md:row-start-3">
          <label htmlFor="from-time-dropdown" className="text-gray-400">
            FROM
          </label>
          <TimeSelector
            id="from-time-dropdown"
            value={eventRange.timeRange.from}
            onChange={(value) =>
              setTimeRange({ ...eventRange.timeRange, from: value })
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
              setTimeRange({ ...eventRange.timeRange, to: value })
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
          <div className="hidden md:col-start-1 md:row-start-14 md:block">
            <DurationSelector
              id="duration-select"
              value={eventRange.duration}
              onChange={(v) => setDuration((v as number) || 0)}
            />
          </div>

          <label className="hidden text-gray-400 md:col-start-1 md:row-start-15 md:flex md:justify-between">
            {type === "new" && "Custom"} Event Code
            {errors.customCode && (
              <ExclamationTriangleIcon className="h-4 w-4 text-red" />
            )}
          </label>
          <div className="hidden md:col-start-1 md:row-start-16 md:block">
            <input
              type="text"
              value={customCode}
              disabled={type === "edit"}
              onChange={handleCustomCodeChange}
              placeholder="optional"
              className={`w-full border-b-1 focus:outline-none ${
                errors.customCode
                  ? "border-red placeholder:text-red"
                  : "border-violet text-blue dark:border-gray-400 dark:text-red"
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
                  <ExclamationTriangleIcon className="h-4 w-4 text-red" />
                )}
              </label>
              <input
                type="text"
                disabled={type === "edit"}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="optional"
                className={cn(
                  "w-full border-b-1 border-gray-300 focus:outline-none dark:border-gray-400",
                  type === "new" && "text-blue dark:text-red",
                  type === "edit" && "cursor-not-allowed opacity-50",
                  errors.customCode ? "border-red placeholder:text-red" : "",
                )}
              />
            </div>
          </details>
        </div>

        <div className="hidden flex-1 md:col-span-10 md:col-start-2 md:row-span-15 md:row-start-2 md:block">
          <GridPreviewDialog eventRange={eventRange} />
        </div>
      </div>

      <div className="min-h-screen md:hidden">
        <GridPreviewDialog eventRange={eventRange} />
        <div className="h-25" />
      </div>

      <div className="fixed bottom-1 left-0 w-full px-8 md:hidden">
        <div
          className="rounded-full bg-blue p-4 text-center text-white dark:bg-red"
          onClick={submitEventInfo}
        >
          {type === "edit" ? "Update Event" : "Create Event"}
        </div>
      </div>
    </div>
  );
}
