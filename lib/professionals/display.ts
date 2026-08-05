import type { ProfessionalProfile } from "@prisma/client";
export function publicLocation(profile: Pick<ProfessionalProfile,"addressVisibility"|"addressLine1"|"addressLine2"|"townCity"|"regionCounty"|"postcode"|"country"|"mobileBusiness"|"serviceRadiusValue"|"serviceRadiusUnit">) {
  if (profile.addressVisibility === "SERVICE_AREA_ONLY" || profile.mobileBusiness) return `${profile.mobileBusiness ? "Mobile business" : "Service area"}${profile.serviceRadiusValue ? ` · within ${profile.serviceRadiusValue} ${profile.serviceRadiusUnit.toLowerCase()}` : ""}${profile.townCity ? ` from ${profile.townCity}` : ""}${profile.country ? `, ${profile.country}` : ""}`;
  if (profile.addressVisibility === "FULL_ADDRESS") return [profile.addressLine1, profile.addressLine2, profile.townCity, profile.regionCounty, profile.postcode, profile.country].filter(Boolean).join(", ");
  return [profile.townCity, profile.regionCounty, profile.country].filter(Boolean).join(", ");
}
