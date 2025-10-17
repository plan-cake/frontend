"use client";

import TimeDropdown from "@/app/ui/components/time-dropdown";
import DateRangeSelector from "@/app/ui/components/date-range/date-range-selector";
import TimezoneSelect from "@/app/ui/components/selectors/timezone-select";
import CustomSelect from "@/app/ui/components/selectors/custom-select";
import GridPreviewDialog from "@/app/ui/components/schedule/grid-preview-dialog";
import { useEventInfo } from "../_lib/schedule/use-event-info";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import formatApiError from "../_utils/format-api-error";
import { SpecificDateRange, WeekdayRange } from "../_lib/schedule/types";
import { findRangeFromWeekdayMap } from "../_lib/schedule/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { cn } from "../_lib/classname";
import { useToast } from "../_lib/toast-context";

const durationOptions = [
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "1 hour", value: 60 },
];

export default function Page() {
  const { addToast } = useToast();
  const [eventNameError, setEventNameError] = useState<string | null>(null);
  const [customCodeError, setCustomCodeError] = useState<boolean>(false);

  const defaultTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
  } = useEventInfo();
  const { title, customCode, eventRange } = state;
  const isSubmitting = useRef(false);
  const router = useRouter();

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const createErrorToast = (message: string) => {
    addToast({
      type: "error",
      id: Date.now() + Math.random(),
      title: "ERROR",
      message: message,
    });
  };

  const createEvent = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    let areErrors: boolean = false;
    setEventNameError(null);
    if (!title) {
      isSubmitting.current = false;
      areErrors = true;

      const errorMessage = "Please enter an event name.";
      setEventNameError(errorMessage);
      createErrorToast(errorMessage);
    }

    // check if custom code is valid
    if (customCode) {
      try {
        const response = await fetch("/api/event/check-code/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ custom_code: customCode }),
        });

        if (!response.ok) {
          areErrors = true;
          const errorMessage =
            "Custom code is not available, please choose another.";
          createErrorToast(errorMessage);
          setCustomCodeError(true);
        }
      } catch (error) {
        console.error("Error checking code:", error);
        throw new Error("Failed to checking code: " + error);
      }
    }

    if (areErrors) {
      return;
    }

    if (state.eventRange.type === "specific") {
      const jsonBody = {
        title,
        duration: eventRange.duration,
        time_zone: eventRange.timezone,
        start_date: formatDate(
          new Date((eventRange as SpecificDateRange).dateRange.from),
        ),
        end_date: formatDate(
          new Date((eventRange as SpecificDateRange).dateRange.to),
        ),
        start_hour: eventRange.timeRange.from,
        end_hour: eventRange.timeRange.to,
        custom_code: customCode || undefined,
      };
      await fetch("/api/event/date-create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonBody),
      })
        .then(async (res) => {
          if (res.ok) {
            const code = (await res.json()).event_code;
            router.push(`/${code}`);
          } else {
            createErrorToast(formatApiError(await res.json()));
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          createErrorToast("An error occurred. Please try again.");
        });
    } else {
      const weekdayRange = findRangeFromWeekdayMap(
        (eventRange as WeekdayRange).weekdays,
      );
      if (weekdayRange.startDay === null || weekdayRange.endDay === null) {
        createErrorToast("Please select at least one weekday.");
        isSubmitting.current = false;
        return;
      }
      const dayNameToIndex: { [key: string]: number } = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };
      const jsonBody = {
        title,
        duration: eventRange.duration,
        time_zone: eventRange.timezone,
        start_weekday: dayNameToIndex[weekdayRange.startDay!],
        end_weekday: dayNameToIndex[weekdayRange.endDay!],
        start_hour: eventRange.timeRange.from,
        end_hour: eventRange.timeRange.to,
        custom_code: customCode || undefined,
      };

      await fetch("/api/event/week-create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonBody),
      })
        .then(async (res) => {
          if (res.ok) {
            const code = (await res.json()).event_code;
            router.push(`/${code}`);
          } else {
            createErrorToast(formatApiError(await res.json()));
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          createErrorToast("An error occurred. Please try again.");
        });
    }

    isSubmitting.current = false;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (eventNameError) {
      setEventNameError(null);
    } else if (e.target.value == "") {
      setEventNameError("Please enter an event name.");
    }

    setTitle(e.target.value);
  };

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (customCodeError) {
      setCustomCodeError(false);
    }

    setCustomCode(e.target.value);
  };

  return (
    <div className="mt-20 flex h-full w-full grow flex-col space-y-4 p-10 md:space-y-8">
      <div className="flex w-full items-center justify-between">
        <div className="md:w-1/2">
          <p
            className={`text-right text-xs text-red ${eventNameError ? "visible" : "invisible"}`}
          >
            {eventNameError ? eventNameError : "Error Placeholder"}
          </p>
          <input
            type="text"
            value={title}
            onChange={handleNameChange}
            placeholder="add event name"
            className={cn(
              "w-full border-b-1 p-1 text-2xl focus:outline-none",
              eventNameError
                ? "border-red placeholder:text-red"
                : "border-violet dark:border-gray-400",
            )}
          />
        </div>

        <button
          className="hidden rounded-full border-2 border-blue bg-blue px-4 py-2 text-sm text-white transition-shadow hover:shadow-[0px_0px_32px_0_rgba(61,115,163,.70)] md:flex dark:border-red dark:bg-red dark:hover:shadow-[0px_0px_32px_0_rgba(255,92,92,.70)]"
          onClick={createEvent}
        >
          Create Event
        </button>
      </div>

      <div className="grid w-full grid-cols-1 gap-y-2 md:grow md:grid-cols-[200px_repeat(10,minmax(0,1fr))] md:grid-rows-[auto_repeat(15,minmax(0,1fr))] md:gap-x-4 md:gap-y-1">
        {/* Date range picker */}
        <div className="flex items-center md:col-span-10">
          <DateRangeSelector
            eventRange={eventRange}
            setEventType={setEventType}
            setWeekdayRange={setWeekdayRange}
            setDateRange={setDateRange}
          />
        </div>

        {/* From/To */}
        <label className="md:col-start-1 md:row-start-2"> Possible Times</label>
        <div className="flex space-x-4 md:col-start-1 md:row-start-3">
          <label className="text-gray-400">FROM</label>
          <TimeDropdown
            defaultTZ={defaultTZ}
            duration={eventRange.duration}
            value={eventRange.timeRange.from}
            onChange={(value) =>
              setTimeRange({ ...eventRange.timeRange, from: value })
            }
          />
        </div>
        <div className="flex space-x-4 md:col-start-1 md:row-start-4">
          <label className="text-gray-400">UNTIL</label>
          <TimeDropdown
            defaultTZ={defaultTZ}
            duration={eventRange.duration}
            value={eventRange.timeRange.to}
            onChange={(to) => setTimeRange({ ...eventRange.timeRange, to })}
          />
        </div>

        {/* Timezone & Duration */}
        <div className="md:contents">
          {/* Desktop: show all options */}
          <label
            htmlFor="Advanced Option"
            className="hidden md:col-start-1 md:row-start-10 md:block"
          >
            Advanced Options
          </label>
          <label
            htmlFor="timezone"
            className="hidden text-gray-400 md:col-start-1 md:row-start-11 md:block"
          >
            Timezone
          </label>
          <div className="hidden md:col-start-1 md:row-start-12 md:block">
            <TimezoneSelect
              value={eventRange.timezone}
              onChange={setTimezone}
            />
          </div>
          <label className="hidden text-gray-400 md:col-start-1 md:row-start-13 md:block">
            Duration
          </label>
          <div className="hidden md:col-start-1 md:row-start-14 md:block">
            <CustomSelect
              options={durationOptions}
              value={eventRange.duration}
              onValueChange={(v) => setDuration((v as number) || 60)}
            />
          </div>

          <label className="hidden text-gray-400 md:col-start-1 md:row-start-15 md:flex md:justify-between">
            Custom Event Code
            {customCodeError && (
              <ExclamationTriangleIcon className="h-4 w-4 text-red" />
            )}
          </label>
          <div className="hidden md:col-start-1 md:row-start-16 md:block">
            <input
              type="text"
              value={customCode}
              onChange={handleCustomCodeChange}
              placeholder="optional"
              className={`w-full border-b-1 focus:outline-none ${
                customCodeError
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
              <label htmlFor="timezone" className="text-gray-400">
                Timezone
              </label>
              <TimezoneSelect
                value={eventRange.timezone}
                onChange={setTimezone}
              />
              <label className="text-gray-400">Duration</label>
              <CustomSelect
                options={durationOptions}
                value={eventRange.duration}
                onValueChange={(v) => setDuration((v as number) || 60)}
              />
              <label className="text-gray-400">Custom Event Code</label>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="optional"
                className="w-full border-b-1 border-gray-300 text-blue focus:outline-none dark:border-gray-400 dark:text-red"
              />
            </div>
          </details>
        </div>

        <div className="hidden flex-1 md:col-span-10 md:col-start-2 md:row-span-15 md:row-start-2 md:block">
          <GridPreviewDialog eventRange={eventRange} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 md:hidden">
        <GridPreviewDialog eventRange={eventRange} />
      </div>

      <div className="fixed bottom-0 left-0 w-full px-4 md:hidden">
        <div
          onClick={createEvent}
          className="rounded-t-full bg-blue p-4 text-center text-white dark:bg-red"
        >
          Create Event
        </div>
      </div>
    </div>
  );
}
