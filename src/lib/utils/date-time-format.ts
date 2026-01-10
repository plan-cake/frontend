import { format, parse, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

/* TIMEZONE UTILS */

export function findTimezoneLabel(tzValue: string): string {
  return formatInTimeZone(new Date(), tzValue, "zzzz");
}

/* DATETIME CONVERSION UTILS
 * from python datetime string (ISO 8601) to Date object
 */

export function formatDateTime(timeslot: string): string {
  return DateTimeToDate(timeslot).toISOString();
}

export function DateTimeToDate(slotIso: string): Date {
  return parseISO(slotIso + "Z");
}

/* DATE UTILS */

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

export function formatDate(date: string, fmt: string): string {
  const parsedDate = parse(date, "yyyy-MM-dd", new Date());
  return format(parsedDate, fmt);
}

/* TIME UTILS */

/*
 * Converts an API time string (in UTC) to the event's local time string.
 */
export function formatApiTime(apiTime: string, eventTimezone: string): string {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const UTC_isoString = `${todayDate}T${apiTime}Z`;
  const localDate = new Date(UTC_isoString);
  return formatInTimeZone(localDate, eventTimezone, "HH:mm");
}

export function formatTimeRange(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return "";

  if (startTime === "00:00" && endTime === "24:00") {
    return "All day";
  }

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

export function formatTime(time: string): string {
  const parsedDate = parse(time, "HH:mm", new Date());
  return format(parsedDate, "h:mm aaa");
}

export function convert24To12(time24: string): string {
  if (!time24) return "";

  const date = parse(time24, "HH:mm", new Date());
  return format(date, "hh:mm a");
}

export function convert12To24(time12: string): string {
  if (!time12) return "";

  const date = parse(time12, "hh:mm a", new Date());
  return format(date, "HH:mm");
}
