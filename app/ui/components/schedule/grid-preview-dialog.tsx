"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { EnterFullScreenIcon, Cross2Icon } from "@radix-ui/react-icons";

import { EventRange } from "@/app/_lib/schedule/types";

import ScheduleGrid from "@/app/ui/components/schedule/schedule-grid";
import TimezoneSelect from "@/app/ui/components/selectors/timezone-select";

interface GridPreviewDialogProps {
  eventRange: EventRange;
}

export default function GridPreviewDialog({
  eventRange,
}: GridPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timezone, setTimezone] = useState(eventRange.timezone);

  const handleTZChange = (newTZ: string | number) => {
    setTimezone(newTZ.toString());
  };

  return (
    <div className="relative h-screen grow md:h-full md:w-full">
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
        className={`flex flex-col space-y-4 overflow-hidden rounded-3xl border border-transparent bg-[#FFFFFF] dark:bg-[#343249] ${
          isOpen
            ? "fixed inset-0 z-50 m-auto h-[85vh] w-[85vw] p-8"
            : "absolute inset-0 h-full w-full pt-4 pr-4 pb-4 pl-2"
        } `}
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
          <motion.div className="h-[85%] grow space-y-4">
            <ScheduleGrid
              mode="preview"
              eventRange={eventRange}
              disableSelect
              timezone={timezone}
            />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <label className="flex items-center text-sm md:ml-[50px]">
                See event in{" "}
                <span className="ml-1 font-bold text-blue dark:text-red">
                  <TimezoneSelect value={timezone} onChange={handleTZChange} />
                </span>
              </label>
              <label className="text-sm md:mr-[20px]">
                Original Event in{" "}
                <span className="font-bold text-blue dark:text-red">
                  {eventRange.timezone}
                </span>
              </label>
            </div>
          </motion.div>
        ) : (
          <motion.div className="h-full grow space-y-4">
            <ScheduleGrid
              mode="preview"
              eventRange={eventRange}
              disableSelect={true}
              timezone={eventRange.timezone}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
