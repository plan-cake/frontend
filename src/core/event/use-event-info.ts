import { useReducer, useCallback } from "react";

import { DateRange } from "react-day-picker";

import { EventInfoReducer } from "@/core/event/reducers/info-reducer";
import { EventInformation, EventRange, WeekdayMap } from "@/core/event/types";

export function useEventInfo(initialData?: {
  title: string;
  code: string;
  eventRange: EventRange;
}) {
  const initialState: EventInformation = {
    title: initialData?.title || "",
    customCode: initialData?.code || "",
    eventRange: initialData?.eventRange || {
      type: "specific",
      duration: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateRange: {
        from: new Date().toISOString(),
        to: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      timeRange: {
        from: 9,
        to: 17,
      },
    },
  };

  if (!initialData?.eventRange?.duration) {
    initialState.eventRange.duration = 0;
  }

  const [state, dispatch] = useReducer(EventInfoReducer, initialState);

  // DISPATCHERS
  const setTitle = useCallback((title: string) => {
    dispatch({ type: "SET_TITLE", payload: title });
  }, []);

  const setCustomCode = useCallback((code: string) => {
    dispatch({ type: "SET_CUSTOM_CODE", payload: code });
  }, []);

  const setEventRangeInfo = useCallback((info: EventRange) => {
    dispatch({ type: "SET_RANGE_INFO", payload: info });
  }, []);

  const setEventType = useCallback((type: "specific" | "weekday") => {
    dispatch({ type: "SET_RANGE_TYPE", payload: type });
  }, []);

  const setTimezone = useCallback((tz: string) => {
    dispatch({ type: "SET_TIMEZONE", payload: tz });
  }, []);

  const setDuration = useCallback((duration: number) => {
    dispatch({ type: "SET_DURATION", payload: duration });
  }, []);

  const setTimeRange = useCallback(
    (timeRange: { from: number; to: number }) => {
      dispatch({ type: "SET_TIME_RANGE", payload: timeRange });
    },
    [],
  );

  const setDateRange = useCallback((dateRange: DateRange | undefined) => {
    if (dateRange?.from && dateRange?.to) {
      const from = dateRange.from.toISOString();
      const to = dateRange.to.toISOString();
      dispatch({
        type: "SET_DATE_RANGE",
        payload: { from, to },
      });
    }
  }, []);

  const setWeekdayRange = useCallback((weekdays: WeekdayMap) => {
    dispatch({ type: "SET_WEEKDAYS", payload: { weekdays } });
  }, []);

  const resetEventInfo = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    setTitle,
    setEventType,
    setCustomCode,
    setEventRangeInfo,
    setTimezone,
    setDuration,
    setTimeRange,
    setDateRange,
    setWeekdayRange,
    resetEventInfo,
  };
}
