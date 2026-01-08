import { useMemo, useReducer, useCallback } from "react";

import { DateRange } from "react-day-picker";

import { expandEventRange } from "@/core/event/lib/expand-event-range";
import { EventInfoReducer } from "@/core/event/reducers/info-reducer";
import { EventInformation, EventRange, WeekdayMap } from "@/core/event/types";
import { checkInvalidDateRangeLength } from "@/features/event/editor/validate-data";
import { useFormErrors } from "@/lib/hooks/use-form-errors";
import { MESSAGES } from "@/lib/messages";

const checkTimeRange = (from: number, to: number): boolean => {
  return to > from;
};

function createInitialState(initialData?: EventInformation): EventInformation {
  const defaultRange = {
    type: "specific" as const,
    duration: 60,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateRange: {
      from: new Date().toISOString(),
      to: new Date().toISOString(),
    },
    timeRange: { from: 9, to: 17 },
  };

  return {
    title: initialData?.title || "",
    customCode: initialData?.customCode || "",
    eventRange: initialData?.eventRange || defaultRange,
    timeslots:
      initialData?.timeslots ||
      expandEventRange(initialData?.eventRange || defaultRange),
  };
}

export function useEventInfo(initialData?: EventInformation) {
  const [state, dispatch] = useReducer(
    EventInfoReducer,
    initialData,
    createInitialState,
  );

  const {
    errors,
    handleError,
    handleGenericError,
    clearAllErrors,
    batchHandleErrors,
  } = useFormErrors();

  // DISPATCHERS (checks input, sets errors if needed)
  const setTitle = useCallback(
    (title: string): void => {
      if (errors.title) handleError("title", "");
      else if (title === "") {
        handleError("title", MESSAGES.ERROR_EVENT_NAME_MISSING);
      }

      dispatch({ type: "SET_TITLE", payload: title });
    },
    [errors.title, handleError],
  );

  const setCustomCode = useCallback(
    (code: string) => {
      handleError("customCode", "");
      dispatch({ type: "SET_CUSTOM_CODE", payload: code });
    },
    [handleError],
  );

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

  const setStartTime = useCallback(
    (time: number) => {
      if (checkTimeRange(time, state.eventRange.timeRange.to)) {
        handleError("timeRange", "");
      } else handleError("timeRange", MESSAGES.ERROR_EVENT_RANGE_INVALID);

      dispatch({ type: "SET_START_TIME", payload: time });
    },
    [state.eventRange.timeRange.to, handleError],
  );

  const setEndTime = useCallback(
    (time: number) => {
      if (checkTimeRange(state.eventRange.timeRange.from, time)) {
        handleError("timeRange", "");
      } else {
        handleError("timeRange", MESSAGES.ERROR_EVENT_RANGE_INVALID);
      }

      dispatch({ type: "SET_END_TIME", payload: time });
    },
    [state.eventRange.timeRange.from, handleError],
  );

  const setDateRange = useCallback(
    (dateRange: DateRange | undefined) => {
      if (checkInvalidDateRangeLength(dateRange)) {
        handleError("dateRange", MESSAGES.ERROR_EVENT_RANGE_TOO_LONG);
      } else {
        handleError("dateRange", "");
      }

      if (dateRange?.from && dateRange?.to) {
        const from = dateRange.from.toISOString();
        const to = dateRange.to.toISOString();
        dispatch({
          type: "SET_DATE_RANGE",
          payload: { from, to },
        });
      }
    },
    [handleError],
  );

  const setWeekdayRange = useCallback((weekdays: WeekdayMap) => {
    dispatch({ type: "SET_WEEKDAYS", payload: { weekdays } });
  }, []);

  const resetEventInfo = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return useMemo(
    () => ({
      state,
      setTitle,
      setEventType,
      setCustomCode,
      setEventRangeInfo,
      setTimezone,
      setDuration,
      setStartTime,
      setEndTime,
      setDateRange,
      setWeekdayRange,
      resetEventInfo,
      errors,
      handleError,
      handleGenericError,
      batchHandleErrors,
      clearAllErrors,
    }),
    [
      state,
      setTitle,
      setEventType,
      setCustomCode,
      setEventRangeInfo,
      setTimezone,
      setDuration,
      setStartTime,
      setEndTime,
      setDateRange,
      setWeekdayRange,
      resetEventInfo,
      errors,
      handleError,
      handleGenericError,
      batchHandleErrors,
      clearAllErrors,
    ],
  );
}
