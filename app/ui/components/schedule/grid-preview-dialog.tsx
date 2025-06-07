"use client";

import { EnterFullScreenIcon, Cross2Icon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import ScheduleGrid from "./schedule-grid";
import { EventRange } from "@/app/_types/schedule-types";
import { useState } from "react";
import TimezoneSelect from "../timezone-select";

import InteractiveScheduleGrid from "./interactive-schedule-grid";
import { UserAvailability } from "@/app/_types/user-availability";

interface GridPreviewDialogProps {
  eventRange: EventRange;
}

export default function GridPreviewDialog({
  eventRange,
}: GridPreviewDialogProps) {
  const [userAvailability, setUserAvailability] = useState<UserAvailability>({
    type: "specific",
    selections: {},
  });

  const [isOpen, setIsOpen] = useState(false);
  const [timezone, setTimezone] = useState(eventRange.timezone);

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  return (
    <div className="h-full">
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-700/40"
          onClick={() => {
            setIsOpen(false);
            setTimezone(eventRange.timezone);
          }}
        />
      )}
      <motion.div
        layout
        className={`flex flex-col space-y-4 rounded border border-transparent ${isOpen ? "fixed inset-0 z-50 m-auto h-[85vh] w-[85vw] rounded-lg bg-white p-8 dark:bg-violet" : "h-full p-2 hover:border-violet dark:hover:border-gray-400"}`}
      >
        <motion.div
          layout
          className="mr-4 flex items-center justify-end space-x-2"
        >
          <label className="text-sm font-medium">Grid Preview</label>
          {isOpen ? (
            <Cross2Icon
              className="h-5 w-5 cursor-pointer hover:text-blue dark:hover:text-red"
              onClick={() => {
                setIsOpen(!isOpen);
                setTimezone(eventRange.timezone);
              }}
            />
          ) : (
            <EnterFullScreenIcon
              className="h-5 w-5 cursor-pointer hover:text-blue dark:hover:text-red"
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </motion.div>
        {isOpen ? (
          <motion.div className="grow space-y-4">
            <ScheduleGrid
              eventRange={eventRange}
              // disableSelect={false}
              timezone={timezone}
            />
            {/* <InteractiveScheduleGrid
              eventRange={eventRange}
              timezone={timezone}
              setUserAvailability={setUserAvailability}
              userAvailability={userAvailability}
            /> */}
            <div className="flex items-center justify-between">
              <TimezoneSelect
                value={timezone}
                onChange={handleTZChange}
                className="ml-[50px] flex items-end gap-4"
                label="See event in"
              />
              <label className="mr-[20px] text-sm">
                Original Event in{" "}
                <span className="font-bold text-blue dark:text-red">
                  {eventRange.timezone}
                </span>
              </label>
            </div>
          </motion.div>
        ) : (
          <motion.div className="grow space-y-4">
            <ScheduleGrid
              eventRange={eventRange}
              disableSelect={true}
              timezone={timezone}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
