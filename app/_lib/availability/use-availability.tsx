import { useReducer, useCallback } from "react";
import { availabilityReducer, AvailabilityState } from "./availability-reducer";
import { createEmptyUserAvailability } from "./utils";

export function useAvailability(
  initialDisplayName = "",
  initialTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
) {
  const initialState: AvailabilityState = {
    displayName: initialDisplayName,
    timeZone: initialTimeZone,
    userAvailability: createEmptyUserAvailability(),
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
