"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { dogRelationships, requiredVerifiedRoleForRelationship } from "@/lib/dog-access";
import { prisma } from "@/lib/prisma";
import type { DogRelationshipType } from "@prisma/client";

function value(formData: FormData, name: string) {
  const entry = formData.get(name);
  return typeof entry === "string" ? entry.trim() : "";
}

function done(code: string): never {
  redirect(`/dashboard?access=${code}#dog-access-requests`);
  throw new Error("Redirect failed");
}

export async function requestDogAccess(formData: FormData) {
  const user = await requireUser();
  const registryNumber = value(formData, "registryNumber").toUpperCase();
  const relationship = value(formData, "relationship") as DogRelationshipType;
  if (!dogRelationships.includes(relationship)) done("invalid");
  const dog = await prisma.dogIdentity.findUnique({
    where: { registryNumber },
    include: { ownerships: { orderBy: { createdAt: "asc" } } },
  });
  // Registry-code lookup is deliberately unavailable for non-public identities.
  if (!dog || dog.visibility !== "PUBLIC" || !dog.ownerships[0]) done("not-found");
  if (dog.ownerships.some((ownership) => ownership.userId === user.id)) done("already-owner");
  const existing = await prisma.dogAccessRequest.findFirst({ where: { dogId: dog.id, requesterUserId: user.id, status: { in: ["PENDING", "APPROVED"] } } });
  if (existing) done("duplicate");
  const requiredRole = requiredVerifiedRoleForRelationship(relationship);
  if (requiredRole) {
    const approvedRole = await prisma.roleApplication.findFirst({ where: { userId: user.id, requestedRole: requiredRole, status: "APPROVED" } });
    if (!approvedRole) done(`verified-${requiredRole.toLowerCase()}-required`);
  }
  try {
    await prisma.dogAccessRequest.create({ data: {
      dogId: dog.id,
      requesterUserId: user.id,
      targetOwnerUserId: dog.ownerships[0].userId,
      requestedRelationship: relationship,
      requestedAccessLevel: "VIEW",
      status: "PENDING",
    } });
  } catch { done("duplicate"); }
  done("requested");
}

async function ownerReview(formData: FormData, status: "APPROVED" | "REJECTED") {
  const user = await requireUser();
  const requestId = value(formData, "requestId");
  const request = await prisma.dogAccessRequest.findUnique({ where: { id: requestId }, include: { dog: { include: { ownerships: true } } } });
  if (!request || request.status !== "PENDING" || request.requesterUserId === user.id || !request.dog.ownerships.some((ownership) => ownership.userId === user.id)) done("unauthorised");
  const changed = await prisma.dogAccessRequest.updateMany({ where: { id: request.id, status: "PENDING" }, data: { status, reviewedAt: new Date(), reviewedById: user.id } });
  if (changed.count !== 1) done("stale");
  done(status === "APPROVED" ? "approved" : "rejected");
}

export async function approveDogAccess(formData: FormData) { return ownerReview(formData, "APPROVED"); }
export async function rejectDogAccess(formData: FormData) { return ownerReview(formData, "REJECTED"); }

export async function cancelDogAccess(formData: FormData) {
  const user = await requireUser();
  const changed = await prisma.dogAccessRequest.updateMany({ where: { id: value(formData, "requestId"), requesterUserId: user.id, status: "PENDING" }, data: { status: "CANCELLED" } });
  done(changed.count === 1 ? "cancelled" : "unauthorised");
}

export async function revokeDogAccess(formData: FormData) {
  const user = await requireUser();
  const request = await prisma.dogAccessRequest.findUnique({ where: { id: value(formData, "requestId") }, include: { dog: { include: { ownerships: true } } } });
  if (!request || request.status !== "APPROVED" || !request.dog.ownerships.some((ownership) => ownership.userId === user.id)) done("unauthorised");
  const changed = await prisma.dogAccessRequest.updateMany({ where: { id: request.id, status: "APPROVED" }, data: { status: "REVOKED", revokedAt: new Date(), revokedById: user.id } });
  done(changed.count === 1 ? "revoked" : "stale");
}
