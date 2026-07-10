import type { OwnerStatusType, RequestedRole, RoleApplication, RoleApplicationStatus } from "@prisma/client";

export const applicationRoles: RequestedRole[] = ["BREEDER", "RESCUE", "FOSTER", "PROFESSIONAL"];
export const activeApplicationStatuses: RoleApplicationStatus[] = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED"];
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
export function formatRole(role: RequestedRole | OwnerStatusType | "MEMBER") { return roleLabels[role as keyof typeof roleLabels] ?? String(role); }
export function hasRole(user: { ownerStatuses?: { status: OwnerStatusType }[] }, role: OwnerStatusType) { return role === "PET_OWNER" ? Boolean(user.ownerStatuses?.some((s) => s.status === role)) : false; }
export function hasVerifiedRole(user: { roleApplications?: Pick<RoleApplication, "requestedRole" | "status">[] }, role: RequestedRole) { return Boolean(user.roleApplications?.some((app) => app.requestedRole === role && app.status === "APPROVED")); }
export const canAccessRescueTools = (user: { roleApplications?: Pick<RoleApplication, "requestedRole" | "status">[] }) => hasVerifiedRole(user, "RESCUE");
export const canAccessProfessionalTools = (user: { roleApplications?: Pick<RoleApplication, "requestedRole" | "status">[] }) => hasVerifiedRole(user, "PROFESSIONAL");
export const canAccessBreederTools = (user: { roleApplications?: Pick<RoleApplication, "requestedRole" | "status">[] }) => hasVerifiedRole(user, "BREEDER");
export function isLegacyUnverifiedStatus(status: OwnerStatusType) { return status !== "PET_OWNER"; }
