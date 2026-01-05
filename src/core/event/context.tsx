"use client";

import { createContext, useContext, ReactNode } from "react";

import { EventInformation } from "@/core/event/types";
import { useEventInfo } from "@/core/event/use-event-info";

type EventContextType = ReturnType<typeof useEventInfo>;

const EventContext = createContext<EventContextType | null>(null);

type EventProviderProps = {
  children: ReactNode;
  initialData?: EventInformation;
};

export function EventProvider({ children, initialData }: EventProviderProps) {
  const eventInfo = useEventInfo(initialData);

  return (
    <EventContext.Provider value={eventInfo}>{children}</EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
}
