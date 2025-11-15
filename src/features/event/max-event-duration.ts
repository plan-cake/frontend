// 30 days in milliseconds
export const MAX_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_DURATION = "30 days";

export function isDurationExceedingMax(start: Date, end: Date): boolean {
  return end.getTime() - start.getTime() > MAX_DURATION_MS;
}
