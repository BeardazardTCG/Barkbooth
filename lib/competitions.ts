import type { CompetitionEligibility, CompetitionStatus } from "@prisma/client";
const ukCountries = new Set(["England", "Scotland", "Wales", "Northern Ireland", "United Kingdom", "UK"]);
export function competitionCountryEligibility(eligibility: CompetitionEligibility | "UK_ONLY" | "INTERNATIONAL", country: string) { return eligibility === "INTERNATIONAL" || ukCountries.has(country); }
export function competitionAcceptsEntries(status: CompetitionStatus | string, opensAt: Date, closesAt: Date, now = new Date()) { return status === "OPEN" && opensAt <= now && closesAt > now; }
export function competitionIsPubliclyVisible(status: CompetitionStatus | string) { return ["PUBLISHED", "OPEN", "CLOSED", "JUDGING", "COMPLETED"].includes(status); }
export function publicEntryStatus(status: string) { return ["SUBMITTED", "FINALIST", "WINNER"].includes(status); }
export function realEntrantCount(entries: { status: string }[]) { return entries.filter((entry) => publicEntryStatus(entry.status)).length; }

export function parseBoundedInteger(raw: string, label: string, minimum: number, maximum: number) {
  if (!/^\d+$/.test(raw)) throw new Error(`${label} must be a whole number.`);
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) throw new Error(`${label} must be between ${minimum} and ${maximum}.`);
  return parsed;
}

export function parsePoundsToPence(raw: string, label: string, maximumPence: number, optional = false) {
  if (optional && raw === "") return null;
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(raw)) throw new Error(`${label} must be a valid pound amount with no more than two decimal places.`);
  const [pounds, decimals = ""] = raw.split(".");
  const pence = Number(pounds) * 100 + Number(decimals.padEnd(2, "0"));
  if (!Number.isSafeInteger(pence) || pence < 0 || pence > maximumPence) throw new Error(`${label} must be between £0 and £${(maximumPence / 100).toLocaleString("en-GB")}.`);
  return pence;
}

export function competitionEntryCtaState(ownedDogIds: string[], entries: { dogId: string }[], maxEntriesPerDog: number) {
  if (ownedDogIds.length === 0) return "NO_DOG" as const;
  const counts = new Map<string, number>();
  for (const entry of entries) if (ownedDogIds.includes(entry.dogId)) counts.set(entry.dogId, (counts.get(entry.dogId) ?? 0) + 1);
  return ownedDogIds.some((id) => (counts.get(id) ?? 0) < maxEntriesPerDog) ? "CAN_ENTER" as const : "EXHAUSTED" as const;
}

export type CompetitionListingGroup = "open" | "upcoming" | "awaiting" | "judging" | "completed";
export function competitionListingGroup(status: string, opensAt: Date, closesAt: Date, now = new Date()): CompetitionListingGroup {
  if (status === "COMPLETED") return "completed";
  if (status === "CLOSED" || status === "JUDGING") return "judging";
  if (status === "OPEN") return now < opensAt ? "upcoming" : now >= closesAt ? "judging" : "open";
  if (status === "PUBLISHED") return now < opensAt ? "upcoming" : now >= closesAt ? "judging" : "awaiting";
  return "upcoming";
}
export const lifecycleTransitions: Record<string, readonly string[]> = {
  DRAFT: ["PUBLISHED", "OPEN", "CANCELLED"], PUBLISHED: ["DRAFT", "OPEN", "CANCELLED"], OPEN: ["CLOSED", "CANCELLED"],
  CLOSED: ["OPEN", "JUDGING", "CANCELLED"], JUDGING: ["COMPLETED", "CANCELLED"], COMPLETED: [], CANCELLED: ["DRAFT"],
};
export function canTransitionCompetition(from: string, to: string) { return lifecycleTransitions[from]?.includes(to) ?? false; }

export function competitionOpenNowDates(opensAt: Date, closesAt: Date, now = new Date()) {
  if (closesAt <= now) throw new Error("A competition cannot open after its closing time.");
  return { opensAt: opensAt > now ? now : opensAt, closesAt };
}
