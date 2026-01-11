import { format, parse, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

/* TIMEZONE UTILS */

// expects a timezone value (e.g., "America/New_York") and returns
// its full label (e.g., "Eastern Daylight Time")
export function findTimezoneLabel(tzValue: string): string {
  return formatInTimeZone(new Date(), tzValue, "zzzz");
}

/*
 * DATETIME CONVERSION UTILS
 * from python datetime string (ISO 8601) to Date object.
 *
 * Both function expect a datetime string without timezone information
 * (e.g., "2024-01-15T10:30:00") and appends "Z" to interpret
 * it as UTC, returning as a string or Date object respectively.
 */

// return Date object
export function parseIsoDateTime(slotIso: string): Date {
  return parseISO(slotIso + "Z");
}

// return ISO string
export function formatDateTime(timeslot: string): string {
  return parseIsoDateTime(timeslot).toISOString();
}

/* DATE UTILS */

// expects two date strings in "YYYY-MM-DD" format
// returns a formatted date range string.
// If both dates are the same, return a single date. If both dates are
// in the same month, omit the month from the 'to' date. Otherwise, the
// full range is shown.
export function formatDateRange(fromDate: string, toDate: string): string {
  const dateFormat = "MMMM d";
  const fromFormatted = formatDate(fromDate, dateFormat);
  const toFormatted = formatDate(toDate, dateFormat);

  if (fromDate === toDate) {
    return fromFormatted;
  } else if (fromDate.slice(0, 7) === toDate.slice(0, 7)) {
    const fromDay = parse(fromDate, "yyyy-MM-dd", new Date()).getDate();
    const toDay = parse(toDate, "yyyy-MM-dd", new Date()).getDate();
    const monthStr = formatDate(fromDate, "MMMM");
    return `${monthStr} ${fromDay}-${toDay}`;
  }
  return `${fromFormatted} - ${toFormatted}`;
}

// expects a date string in "YYYY-MM-DD" format and a format string
// returns the formatted date string
export function formatDate(date: string, fmt: string): string {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return format(parsedDate, fmt);
}

/* TIME UTILS */

// expects a time string from the API in "HH:mm" format in UTC
// and an event timezone (e.g., "America/New_York")
// returns the time convered to and formatted in the event's timezone
// in "HH:mm" format
export function formatApiTime(apiTime: string, eventTimezone: string): string {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const UTC_isoString = `${todayDate}T${apiTime}Z`;
  const localDate = new Date(UTC_isoString);
  return formatInTimeZone(localDate, eventTimezone, "HH:mm");
}

// expects two time strings in "HH:mm" format
// returns a formatted time range string.
// If the time range is the full day (00:00 - 24:00), it returns "All day".
export function formatTimeRange(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "";

  if (startTime === "00:00" && endTime === "24:00") {
    return "All day";
  }

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

// expects a time string in "HH:mm" format
// returns the time formatted in "h:mm aaa" format (e.g., "2:30 PM")
export function formatTime(time: string): string {
  const parsedDate = parse(time, "HH:mm", new Date());
  return format(parsedDate, "h:mm aaa");
}

// expects a time string in "HH:mm" (24-hour) format
// returns the time converted to "hh:mm AM/PM" (12-hour) format
export function convert24To12(time24: string): string {
  if (!time24) return "";

  const date = parse(time24, "HH:mm", new Date());
  return format(date, "hh:mm a");
}

// expects a time string in "hh:mm AM/PM" (12-hour) format
// returns the time converted to "HH:mm" (24-hour) format
export function convert12To24(time12: string): string {
  if (!time12) return "";

  const date = parse(time12, "hh:mm a", new Date());
  return format(date, "HH:mm");
}
