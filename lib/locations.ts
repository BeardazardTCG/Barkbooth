export const supportedLocations = ["England", "Scotland", "Wales", "Northern Ireland", "Republic of Ireland"] as const;
export type SupportedLocation = (typeof supportedLocations)[number];

export function isSupportedLocation(value: string): value is SupportedLocation {
  return supportedLocations.includes(value as SupportedLocation);
}

export function dashboardLocation(value: string) {
  return isSupportedLocation(value) ? value : "Location not set";
}
