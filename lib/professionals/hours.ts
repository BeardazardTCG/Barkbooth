export const weekdayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export type PublicOpeningHour = { dayOfWeek: number; closed: boolean; opensAt: string | null; closesAt: string | null; secondOpensAt: string | null; secondClosesAt: string | null };
export function formatOpeningHour(hour: PublicOpeningHour) {
  if (hour.closed) return "Closed";
  if (!hour.opensAt || !hour.closesAt) return "Hours not supplied";
  const first = `${hour.opensAt}–${hour.closesAt}`;
  return hour.secondOpensAt && hour.secondClosesAt ? `${first}, ${hour.secondOpensAt}–${hour.secondClosesAt}` : first;
}
