"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import CopyToast from "@/components/copy-toast";
import HeaderSpacer from "@/components/header-spacer";
import { useAvailability } from "@/core/availability/use-availability";
import { convertAvailabilityToGrid } from "@/core/availability/utils";
import { EventRange } from "@/core/event/types";
import { SelfAvailabilityResponse } from "@/features/event/availability/fetch-data";
import { validateAvailabilityData } from "@/features/event/availability/validate-data";
import TimeZoneSelector from "@/features/event/components/timezone-selector";
import ScheduleGrid from "@/features/event/grid/grid";
import { EventInfo } from "@/features/event/info-drawer";
import EventInfoDrawer from "@/features/event/info-drawer";
import { useToast } from "@/features/toast/context";
import formatApiError from "@/lib/utils/api/format-api-error";

export default function ClientPage({
  eventCode,
  eventName,
  eventRange,
  initialData,
}: {
  eventCode: string;
  eventName: string;
  eventRange: EventRange;
  initialData: SelfAvailabilityResponse | null;
}) {
  const router = useRouter();

  // AVAILABILITY STATE
  const { state, setDisplayName, setTimeZone, toggleSlot } =
    useAvailability(initialData);
  const { displayName, timeZone, userAvailability } = state;

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
    if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: "" }));
    else if (e.target.value === "") {
      setErrors((prev) => ({
        ...prev,
        displayName: "Please enter your name.",
      }));
    }
    setDisplayName(e.target.value);
  };

  // SUBMIT AVAILABILITY
  const handleSubmitAvailability = async () => {
    setErrors({}); // reset errors

    try {
      const validationErrors = await validateAvailabilityData(state, eventCode);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        Object.values(validationErrors).forEach(createErrorToast);
        return;
      }

      const availabilityGrid = convertAvailabilityToGrid(
        userAvailability,
        eventRange,
      );

      const payload = {
        event_code: eventCode,
        display_name: displayName,
        availability: availabilityGrid,
        time_zone: timeZone,
      };

      const response = await fetch("/api/availability/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) router.push(`/${eventCode}`);
      else createErrorToast(formatApiError(await response.json()));
    } catch (error) {
      console.error("Error submitting availability:", error);
      createErrorToast("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col space-y-4 pl-6 pr-6">
      <HeaderSpacer />
      {/* Header and Button Row */}
      <div className="flex w-full flex-wrap justify-between md:flex-row">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>

        <div className="flex items-center gap-2">
          <CopyToast code={eventCode} />
          {initialData && (
            <button
              onClick={() => {
                router.push(`/${eventCode}`);
              }}
              className="border-blue bg-blue dark:border-red dark:bg-red dark:hover:bg-red/25 hover:text-violet hidden rounded-full border-2 px-4 py-2 text-sm text-white transition-shadow hover:cursor-pointer hover:bg-blue-100 md:flex dark:hover:text-white"
            >
              Cancel Edits
            </button>
          )}
          <button
            onClick={handleSubmitAvailability}
            className="border-blue bg-blue dark:border-red dark:bg-red dark:hover:bg-red/25 hover:text-violet hidden rounded-full border-2 px-4 py-2 text-sm text-white transition-shadow hover:cursor-pointer hover:bg-blue-100 md:flex dark:hover:text-white"
          >
            {initialData ? "Update" : "Submit"} Availability
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 flex h-fit flex-col gap-4 md:mb-0 md:flex-row">
        {/* Left Panel */}
        <div className="md:top-25 h-fit w-full shrink-0 space-y-6 overflow-y-auto md:sticky md:w-80">
          <div className="w-fit">
            <p
              className={`text-red text-right text-xs ${errors.displayName ? "visible" : "invisible"}`}
            >
              {errors.displayName ? errors.displayName : "Error Placeholder"}
            </p>
            Hi,{" "}
            <input
              required
              type="text"
              value={displayName}
              onChange={handleNameChange}
              placeholder="add your name"
              className={`inline-block w-auto border-b bg-transparent px-1 focus:outline-none ${
                errors.displayName
                  ? "border-red placeholder:text-red"
                  : "border-gray-400"
              }`}
            />
            <br />
            add your availabilities here
          </div>

          {/* Desktop-only Event Info */}
          <div className="bg-panel hidden rounded-3xl p-6 md:block">
            <EventInfo eventRange={eventRange} />
          </div>

          <div className="bg-panel rounded-3xl p-4 text-sm">
            Displaying event in
            <span className="text-accent ml-1 font-bold">
              <TimeZoneSelector
                id="timezone-select"
                value={timeZone}
                onChange={setTimeZone}
              />
            </span>
          </div>
        </div>

        {/* Right Panel */}
        <ScheduleGrid
          mode="paint"
          eventRange={eventRange}
          timezone={timeZone}
          onToggleSlot={toggleSlot}
          userAvailability={userAvailability}
        />
      </div>

      <div className="fixed bottom-1 left-0 w-full px-8 md:hidden">
        <div
          onClick={handleSubmitAvailability}
          className="bg-blue dark:bg-red rounded-full p-4 text-center text-white"
        >
          Submit Availability
        </div>
      </div>
    </div>
  );
}
