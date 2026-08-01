import type { CompetitionEligibility, CompetitionStatus } from "@prisma/client";
const ukCountries = new Set(["England", "Scotland", "Wales", "Northern Ireland", "United Kingdom", "UK"]);
export function competitionCountryEligibility(eligibility: CompetitionEligibility | "UK_ONLY" | "INTERNATIONAL", country: string) { return eligibility === "INTERNATIONAL" || ukCountries.has(country); }
export function competitionAcceptsEntries(status: CompetitionStatus | string, opensAt: Date, closesAt: Date, now = new Date()) { return status === "OPEN" && opensAt <= now && closesAt > now; }
export function competitionIsPubliclyVisible(status: CompetitionStatus | string) { return ["PUBLISHED", "OPEN", "CLOSED", "JUDGING", "COMPLETED"].includes(status); }
export function publicEntryStatus(status: string) { return ["SUBMITTED", "FINALIST", "WINNER"].includes(status); }
export function realEntrantCount(entries: { status: string }[]) { return entries.filter((entry) => publicEntryStatus(entry.status)).length; }
export const lifecycleTransitions: Record<string, readonly string[]> = {
  DRAFT: ["PUBLISHED", "OPEN", "CANCELLED"], PUBLISHED: ["DRAFT", "OPEN", "CANCELLED"], OPEN: ["CLOSED", "CANCELLED"],
  CLOSED: ["OPEN", "JUDGING", "CANCELLED"], JUDGING: ["COMPLETED", "CANCELLED"], COMPLETED: [], CANCELLED: ["DRAFT"],
};
export function canTransitionCompetition(from: string, to: string) { return lifecycleTransitions[from]?.includes(to) ?? false; }

export function competitionOpenNowDates(opensAt: Date, closesAt: Date, now = new Date()) {
  if (closesAt <= now) throw new Error("A competition cannot open after its closing time.");
  return { opensAt: opensAt > now ? now : opensAt, closesAt };
}
