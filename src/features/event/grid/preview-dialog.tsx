"use client";

import { useState } from "react";

import { EnterFullScreenIcon, Cross2Icon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";

import { EventRange } from "@/core/event/types";
import TimeZoneSelector from "@/features/event/components/timezone-selector";
import ScheduleGrid from "@/features/event/grid/grid";

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
            : "absolute inset-0 h-full w-full pb-4 pl-2 pr-4 pt-4"
        } `}
      >
        <motion.div
          layout
          className="mr-4 flex items-center justify-end space-x-2"
        >
          <label className="text-sm font-medium">Grid Preview</label>
          {isOpen ? (
            <Cross2Icon
              className="hover:text-blue dark:hover:text-red h-5 w-5 cursor-pointer"
              onClick={() => {
                setIsOpen(!isOpen);
                setTimezone(eventRange.timezone);
              }}
            />
          ) : (
            <EnterFullScreenIcon
              className="hover:text-blue dark:hover:text-red h-5 w-5 cursor-pointer"
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
              <label
                htmlFor="timezone-select"
                className="flex items-center text-sm md:ml-[50px]"
              >
                See event in{" "}
                <span className="text-blue dark:text-red ml-1 font-bold">
                  <TimeZoneSelector
                    id="timezone-select"
                    value={timezone}
                    onChange={handleTZChange}
                  />
                </span>
              </label>
              <label className="text-sm md:mr-[20px]">
                Original Event in{" "}
                <span className="text-blue dark:text-red font-bold">
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
