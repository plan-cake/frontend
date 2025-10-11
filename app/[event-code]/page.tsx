"use client";

import { useAvailability } from "@/app/_lib/availability/use-availability";
import { useEffect } from "react";

import CopyToast from "@/app/ui/components/copy-toast";
import EventInfoDrawer, {
  EventInfo,
} from "@/app/ui/components/event-info-drawer";
import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import TimezoneSelect from "@/app/ui/components/selectors/timezone-select";
import { useParams } from "next/navigation";
import formatApiError from "../_utils/format-api-error";
import { generateWeekdayMap } from "../_lib/schedule/utils";
import { useEventInfo } from "../_lib/schedule/use-event-info";
import { convertAvailabilityToGrid } from "../_lib/availability/utils";

export default function Page() {
  // AVAILABILITY STATE
  const { state, setDisplayName, setTimeZone, toggleSlot } =
    useAvailability("John Doe");
  const { displayName, timeZone, userAvailability } = state;

  // EVENT DATA STATE
  const { state: eventState, setTitle, setEventRangeInfo } = useEventInfo();
  const { eventRange, title: eventName } = eventState;

  // get the event data from the code in the URL
  const params = useParams();
  const eventCode = params?.["event-code"];
  useEffect(() => {
    fetch("/api/event/get-details?event_code=" + eventCode, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          if (data.event_type === "Date") {
            setEventRangeInfo({
              type: "specific",
              duration: data.duration,
              timezone: data.time_zone,
              dateRange: {
                from: data.start_date,
                to: data.end_date,
              },
              timeRange: {
                from: data.start_hour,
                to: data.end_hour,
              },
            });
          } else {
            const weekdays = generateWeekdayMap(
              data.start_weekday,
              data.end_weekday,
            );

            setEventRangeInfo({
              type: "weekday",
              duration: data.duration,
              timezone: data.time_zone,
              weekdays: weekdays,
              timeRange: {
                from: data.start_hour,
                to: data.end_hour,
              },
            });
          }
        } else {
          alert(formatApiError(await res.json()));
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, [eventCode]);

  const handleSubmitAvailability = async () => {
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
    } catch (error) {
      console.error("Error submitting availability:", error);
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
          <button className="hidden rounded-full border-2 border-blue bg-blue px-4 py-2 text-sm text-white transition-shadow hover:shadow-[0px_0px_32px_0_rgba(61,115,163,.70)] md:flex dark:border-red dark:bg-red dark:hover:shadow-[0px_0px_32px_0_rgba(255,92,92,.70)]">
            Submit Availability
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8 flex h-fit flex-col gap-4 md:mb-0 md:flex-row">
        {/* Left Panel */}
        <div className="h-fit w-full shrink-0 space-y-6 overflow-y-auto md:sticky md:top-30 md:w-80">
          <div>
            <span className="text-lg">
              Hi,{" "}
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="add your name"
                className="inline-block w-auto border-b border-violet bg-transparent px-1 focus:outline-none dark:border-gray-400"
              />
              <br />
              add your availabilities here
            </span>
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
        <button
          onClick={handleSubmitAvailability}
          className="rounded-t-full bg-blue p-4 text-center text-white dark:bg-red"
        >
          Submit Availability
        </button>
      </div>
    </div>
  );
}
