import { SelfAvailabilityResponse } from "@/app/_utils/fetch-data";
import { useCallback, useReducer } from "react";
import { availabilityReducer, AvailabilityState } from "./availability-reducer";
import { createUserAvailability } from "./utils";

export function useAvailability(initialData: SelfAvailabilityResponse | null) {
  const initialTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isoStrings = [];
  if (initialData && initialData.available_dates) {
    for (const dateStr of initialData.available_dates) {
      isoStrings.push(new Date(dateStr).toISOString());
    }
  }

  const initialState: AvailabilityState = {
    displayName: initialData?.display_name || "",
    timeZone: initialData?.time_zone || initialTimeZone,
    userAvailability: createUserAvailability(isoStrings),
  };

  const [state, dispatch] = useReducer(availabilityReducer, initialState);

  // DISPATCHERS
  const setDisplayName = useCallback((name: string) => {
    dispatch({ type: "SET_DISPLAY_NAME", payload: name });
  }, []);

  const setTimeZone = useCallback((tz: string) => {
    dispatch({ type: "SET_TIME_ZONE", payload: tz });
  }, []);

  const toggleSlot = useCallback((slot: string, togglingOn: boolean) => {
    dispatch({ type: "TOGGLE_SLOT", payload: { slot, togglingOn } });
  }, []);

  const resetAvailability = useCallback(() => {
    dispatch({ type: "RESET_AVAILABILITY" });
  }, []);

  return {
    state,
    setDisplayName,
    setTimeZone,
    toggleSlot,
    resetAvailability,
  };
}
