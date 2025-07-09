"use client";

import { useState } from "react";
import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";

export default function Page() {
  const [userName, setUserName] = useState("John Doe");
  const eventName = "Sample Event";
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    9,
    0,
    0,
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    16,
    0,
    0,
  );

  const eventRange = {
    type: "specific" as const,
    duration: 60 * 7,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateRange: {
      from: today,
      to: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
    timeRange: {
      from: startOfDay,
      to: endOfDay,
    },
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl dark:border-gray-400">{eventName}</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-full border-2 border-blue px-4 py-2 text-sm hover:bg-blue-100 dark:border-red dark:hover:bg-red/25">
            Copy Link
          </button>
          <button className="rounded-full bg-blue px-4 py-2 text-sm text-white dark:bg-red">
            Submit Availability
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Left Panel - Fixed Event Info */}
        <div className="w-80 shrink-0 overflow-y-auto">
          <div className="mb-6">
            <span className="text-lg">
              Hi,{" "}
              <input
                type="text"
                placeholder="add your name"
                // value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="inline-block w-auto border-b border-violet bg-transparent px-1 focus:outline-none dark:border-gray-400"
                style={{ minWidth: "6ch" }}
              />
              <br />
              add your availabilities here
            </span>
          </div>

          <div className="space-y-6 rounded-3xl bg-[#FFFFFF] p-6 dark:bg-[#343249]">
            <h2 className="mb-2 text-lg font-semibold">Event Details</h2>
            <div>
              <span className="font-medium text-blue dark:text-red">
                Possible Dates:
              </span>
              <div className="">
                {eventRange.dateRange.from.toLocaleDateString()} –{" "}
                {eventRange.dateRange.to.toLocaleDateString()}
              </div>
            </div>
            <div>
              <span className="font-medium text-blue dark:text-red">
                Possible Times:
              </span>
              <div className="">
                {eventRange.timeRange.from.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                –{" "}
                {eventRange.timeRange.to.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div>
              <span className="font-medium text-blue dark:text-red">
                Original Event Timezone:
              </span>
              <div className="">{eventRange.timezone}</div>
            </div>

            <div>
              <span className="font-medium text-blue dark:text-red">
                Intended Duration:
              </span>
              <div className="">{eventRange.duration} minutes</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Scrollable Schedule */}
        <ScheduleGrid eventRange={eventRange} timezone={eventRange.timezone} />
      </div>
    </div>
  );
}
