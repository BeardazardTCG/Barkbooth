import type { DogRelationshipType, RequestedRole } from "@prisma/client";

export const dogRelationships: DogRelationshipType[] = ["CO_OWNER", "KEEPER", "CONTRACT_HOLDER", "FOSTER", "RESCUE", "BREEDER", "VETERINARY", "GROOMER", "TRAINER", "SITTER", "OTHER_PROFESSIONAL"];
export const professionalRelationships: DogRelationshipType[] = ["VETERINARY", "GROOMER", "TRAINER", "SITTER", "OTHER_PROFESSIONAL"];
export const dualOwnershipRelationships: DogRelationshipType[] = ["CO_OWNER", "KEEPER"];
export const contractedCareRelationships: DogRelationshipType[] = ["CONTRACT_HOLDER", "FOSTER", "RESCUE", "BREEDER"];
const requiredRoles: Partial<Record<DogRelationshipType, RequestedRole>> = {
  RESCUE: "RESCUE",
  FOSTER: "FOSTER",
  BREEDER: "BREEDER",
  VETERINARY: "PROFESSIONAL",
  GROOMER: "PROFESSIONAL",
  TRAINER: "PROFESSIONAL",
  SITTER: "PROFESSIONAL",
  OTHER_PROFESSIONAL: "PROFESSIONAL",
};

type RoleState = { requestedRole: string; status: string };

export function requiredVerifiedRoleForRelationship(relationship: DogRelationshipType) {
  return requiredRoles[relationship] ?? null;
}

export function hasRequiredVerifiedRole(relationship: DogRelationshipType, applications: RoleState[]) {
  const requiredRole = requiredVerifiedRoleForRelationship(relationship);
  return !requiredRole || applications.some((application) => application.requestedRole === requiredRole && application.status === "APPROVED");
}

export function isDogAccessCurrentlyActive(access: { status: string; requestedRelationship: DogRelationshipType; requester: { roleApplications: RoleState[] } }) {
  return access.status === "APPROVED" && hasRequiredVerifiedRole(access.requestedRelationship, access.requester.roleApplications);
}

export const relationshipLabels: Record<DogRelationshipType, string> = {
  CO_OWNER: "Co-owner", KEEPER: "Keeper", CONTRACT_HOLDER: "Contract holder", FOSTER: "Foster",
  RESCUE: "Rescue", BREEDER: "Breeder", VETERINARY: "Veterinary professional", GROOMER: "Groomer",
  TRAINER: "Trainer", SITTER: "Sitter", OTHER_PROFESSIONAL: "Other professional",
};

export function connectionDisplayName(user: { displayName: string; roleApplications: { requestedRole: string; status: string; publicDisplayName: string | null; organisationName: string | null }[] }, relationship: DogRelationshipType) {
  if (professionalRelationships.includes(relationship)) {
    const approved = user.roleApplications.find((application) => application.requestedRole === "PROFESSIONAL" && application.status === "APPROVED");
    if (approved) return approved.publicDisplayName || approved.organisationName || user.displayName;
  }
  return user.displayName;
}
