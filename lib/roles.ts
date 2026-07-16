import type { OwnerStatusType, PromotionTier, RequestedRole, RoleApplication, RoleApplicationStatus, User } from "@prisma/client";

export const applicationRoles: RequestedRole[] = ["BREEDER", "RESCUE", "FOSTER", "PROFESSIONAL"];
export const activeApplicationStatuses: RoleApplicationStatus[] = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"];
export const roleLabels: Record<RequestedRole | "PET_OWNER" | "MEMBER", string> = {
  MEMBER: "Bark Booth Member",
  PET_OWNER: "Pet Owner",
  BREEDER: "Breeder",
  RESCUE: "Rescue",
  FOSTER: "Foster",
  PROFESSIONAL: "Professional",
};
export const verifiedRoleLabels: Record<RequestedRole, string> = {
  BREEDER: "Verified Breeder",
  RESCUE: "Verified Rescue",
  FOSTER: "Verified Foster",
  PROFESSIONAL: "Verified Professional",
};

export type RoleApplicationSummary = Pick<RoleApplication, "requestedRole" | "status">;
export type PromotionApplicationSummary = RoleApplicationSummary & Pick<RoleApplication, "isFeatured" | "featuredUntil" | "promotionTier">;

export function formatRole(role: RequestedRole | OwnerStatusType | "MEMBER") { return roleLabels[role as keyof typeof roleLabels] ?? String(role); }
export function isBarkBoothMember(user: Pick<User, "id"> | null | undefined) { return Boolean(user?.id); }
export function isPetOwner(user: { ownerStatuses?: { status: OwnerStatusType }[] }) { return Boolean(user.ownerStatuses?.some((s) => s.status === "PET_OWNER")); }
export function hasRole(user: { ownerStatuses?: { status: OwnerStatusType }[] }, role: OwnerStatusType) { return role === "PET_OWNER" ? isPetOwner(user) : false; }
export function hasVerifiedRole(user: { roleApplications?: RoleApplicationSummary[] }, role: RequestedRole) { return Boolean(user.roleApplications?.some((app) => app.requestedRole === role && app.status === "APPROVED")); }
export const canAccessRescueTools = (user: { roleApplications?: RoleApplicationSummary[] }) => hasVerifiedRole(user, "RESCUE");
export const canAccessProfessionalTools = (user: { roleApplications?: RoleApplicationSummary[] }) => hasVerifiedRole(user, "PROFESSIONAL");
export const canAccessBreederTools = (user: { roleApplications?: RoleApplicationSummary[] }) => hasVerifiedRole(user, "BREEDER");
export const canAccessFosterTools = (user: { roleApplications?: RoleApplicationSummary[] }) => hasVerifiedRole(user, "FOSTER");
export const canReceiveFreeRescueRegistrations = canAccessRescueTools;
export const canCreateProfessionalListing = canAccessProfessionalTools;

export function isActiveProfessionalPromotion(app: PromotionApplicationSummary, now = new Date()) {
  return app.status === "APPROVED" && app.requestedRole === "PROFESSIONAL" && (app.promotionTier === "FEATURED" || app.isFeatured) && (!app.featuredUntil || app.featuredUntil > now);
}

export function canReceiveProfessionalPromotion(user: { roleApplications?: PromotionApplicationSummary[] }, now = new Date()) {
  return Boolean(user.roleApplications?.some((app) => isActiveProfessionalPromotion(app, now)));
}

export function isLegacyUnverifiedStatus(status: OwnerStatusType) { return status !== "PET_OWNER"; }
