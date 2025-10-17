"use client";

import { useState } from "react";
import { useAvailability } from "@/app/_lib/availability/use-availability";
import { useRouter } from "next/navigation";
import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import EventInfoDrawer from "@/app/ui/components/event-info-drawer";
import CopyToast from "@/app/ui/components/toasts/copy-toast";
import TimezoneSelect from "@/app/ui/components/selectors/timezone-select";
import { EventInfo } from "@/app/ui/components/event-info-drawer";
import { EventRange } from "@/app/_lib/schedule/types";
import formatApiError from "@/app/_utils/format-api-error";
import { convertAvailabilityToGrid } from "@/app/_lib/availability/utils";
import { useToast } from "@/app/_lib/toast-context";

export default function AvailabilityPage({
  eventCode,
  eventName,
  eventRange,
}: {
  eventCode: string;
  eventName: string;
  eventRange: EventRange;
}) {
  const router = useRouter();
  const { addToast } = useToast();
  const [nameError, setNameError] = useState<string | null>(null);

  // AVAILABILITY STATE
  const { state, setDisplayName, setTimeZone, toggleSlot } =
    useAvailability("");
  const { displayName, timeZone, userAvailability } = state;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (nameError) {
      setNameError(null);
    } else if (e.target.value == "") {
      setNameError("Please enter your name.");
    }
    setDisplayName(e.target.value);
  };

  const createErrorToast = (message: string) => {
    addToast({
      type: "error",
      id: Date.now() + Math.random(),
      title: "ERROR",
      message: message,
    });
  };

  // SUBMIT AVAILABILITY
  const handleSubmitAvailability = async () => {
    let areErrors: boolean = false;
    setNameError(null);

    if (!displayName.trim()) {
      const errorMessage = "Please enter your name.";
      areErrors = true;
      setNameError(errorMessage);
      createErrorToast(errorMessage);
    } else {
      try {
        const response = await fetch("/api/availability/check-display-name/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_code: eventCode,
            display_name: displayName,
          }),
        });

        if (!response.ok) {
          areErrors = true;
          const errorMessage = "Name is not available, please choose another.";
          createErrorToast(errorMessage);
          setNameError(errorMessage);
        }
      } catch (error) {
        console.error("Error checking display name:", error);
        throw new Error("Failed to checking display name: " + error);
      }
    }

    if (!userAvailability || userAvailability.size === 0) {
      areErrors = true;
      createErrorToast("Please enter your availability!");
    }

    if (areErrors) {
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

    try {
      const response = await fetch("/api/availability/add/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) router.push(`/${eventCode}/results`);
      else {
        createErrorToast(formatApiError(await response.json()));
      }
    } catch (error) {
      console.error("Error submitting availability:", error);
      throw new Error("Failed to submit availability: " + error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header and Button Row */}
      <div className="flex justify-between md:flex-row">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
          <EventInfoDrawer eventRange={eventRange} />
        </div>

        <div className="flex items-center gap-2">
          <CopyToast label="Copy Link" />
          <button
            onClick={handleSubmitAvailability}
            className="hidden rounded-full border-2 border-blue bg-blue px-4 py-2 text-sm text-white transition-shadow hover:shadow-[0px_0px_32px_0_rgba(61,115,163,.70)] md:flex dark:border-red dark:bg-red dark:hover:shadow-[0px_0px_32px_0_rgba(255,92,92,.70)]"
          >
            Submit Availability
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 flex h-fit flex-col gap-4 md:mb-0 md:flex-row">
        {/* Left Panel */}
        <div className="h-fit w-full shrink-0 space-y-6 overflow-y-auto md:sticky md:top-30 md:w-80">
          <div className="w-fit">
            <p
              className={`text-right text-xs text-red ${nameError ? "visible" : "invisible"}`}
            >
              {nameError ? nameError : "Error Placeholder"}
            </p>
            Hi,{" "}
            <input
              required
              type="text"
              value={displayName}
              onChange={handleNameChange}
              placeholder="add your name"
              className={`inline-block w-auto border-b bg-transparent px-1 focus:outline-none ${
                nameError
                  ? "border-red placeholder:text-red"
                  : "border-violet dark:border-gray-400"
              }`}
            />
            <br />
            add your availabilities here
          </div>

          {/* Desktop-only Event Info */}
          <div className="hidden rounded-3xl bg-[#FFFFFF] p-6 md:block dark:bg-[#343249]">
            <EventInfo eventRange={eventRange} />
          </div>

          <div className="rounded-3xl bg-[#FFFFFF] p-4 text-sm dark:bg-[#343249]">
            Displaying event in
            <span className="ml-1 font-bold text-blue dark:text-red">
              <TimezoneSelect value={timeZone} onChange={setTimeZone} />
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

      <div className="fixed bottom-0 left-0 w-full px-4 md:hidden">
        <div
          onClick={handleSubmitAvailability}
          className="rounded-t-full bg-blue p-4 text-center text-white dark:bg-red"
        >
          Submit Availability
        </div>
      </div>
    </div>
  );
}
