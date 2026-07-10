"use server";
import type { RequestedRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
export async function approveRoleApplication({ applicationId, reviewerId }: { applicationId: string; reviewerId: string }) { return prisma.roleApplication.update({ where: { id: applicationId }, data: { status: "APPROVED", reviewedAt: new Date(), reviewedById: reviewerId, rejectionReason: null } }); }
export async function rejectRoleApplication({ applicationId, reviewerId, rejectionReason }: { applicationId: string; reviewerId: string; rejectionReason: string }) { return prisma.roleApplication.update({ where: { id: applicationId }, data: { status: "REJECTED", reviewedAt: new Date(), reviewedById: reviewerId, rejectionReason } }); }
export async function suspendRoleApplication({ applicationId, reviewerId, reason }: { applicationId: string; reviewerId: string; reason?: string }) { return prisma.roleApplication.update({ where: { id: applicationId }, data: { status: "SUSPENDED", reviewedAt: new Date(), reviewedById: reviewerId, rejectionReason: reason ?? null } }); }
export async function verifiedUsersForRole(role: RequestedRole) { return prisma.roleApplication.findMany({ where: { requestedRole: role, status: "APPROVED" } }); }
