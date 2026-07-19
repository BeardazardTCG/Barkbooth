import type { DogRelationshipType } from "@prisma/client";

export const dogRelationships: DogRelationshipType[] = ["CO_OWNER", "KEEPER", "CONTRACT_HOLDER", "FOSTER", "RESCUE", "BREEDER", "VETERINARY", "GROOMER", "TRAINER", "SITTER", "OTHER_PROFESSIONAL"];
export const professionalRelationships: DogRelationshipType[] = ["VETERINARY", "GROOMER", "TRAINER", "SITTER", "OTHER_PROFESSIONAL"];
export const dualOwnershipRelationships: DogRelationshipType[] = ["CO_OWNER", "KEEPER"];
export const contractedCareRelationships: DogRelationshipType[] = ["CONTRACT_HOLDER", "FOSTER", "RESCUE", "BREEDER"];

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
