"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProfessionalCategory, RequestedRole, RoleApplicationStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { activeApplicationStatuses, applicationRoles } from "@/lib/roles";

const professionalCategories: ProfessionalCategory[] = ["TRAINER", "GROOMER", "DOG_WALKER", "BEHAVIOURIST", "PHOTOGRAPHER", "VETERINARY_CARE", "OTHER"];

function s(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v.trim() : "";
}

function role(v: FormDataEntryValue | null): RequestedRole {
  const r = s(v) as RequestedRole;
  if (!applicationRoles.includes(r)) throw new Error("Invalid role");
  return r;
}

function professionalCategory(v: FormDataEntryValue | null): ProfessionalCategory | null {
  const category = s(v) as ProfessionalCategory;
  if (!category) return null;
  if (!professionalCategories.includes(category)) throw new Error("Invalid professional category");
  return category;
}

async function editable(id: string, userId: string) {
  const app = await prisma.roleApplication.findFirst({ where: { id, userId } });
  if (!app) throw new Error("Application not found");
  if (!["DRAFT", "REJECTED"].includes(app.status)) throw new Error("Submitted applications cannot be edited");
  return app;
}

export async function createApplicationDraft(formData: FormData) {
  const user = await requireUser();
  const requestedRole = role(formData.get("requestedRole"));
  const existing = await prisma.roleApplication.findFirst({ where: { userId: user.id, requestedRole, status: { in: activeApplicationStatuses } } });
  if (existing) redirect(`/account/applications/${existing.id}`);
  const app = await prisma.roleApplication.create({ data: { userId: user.id, requestedRole, email: user.email, publicDisplayName: user.displayName } });
  redirect(`/account/applications/${app.id}`);
}

export async function updateApplicationDraft(formData: FormData) {
  const user = await requireUser();
  const id = s(formData.get("applicationId"));
  await editable(id, user.id);
  await prisma.roleApplication.update({
    where: { id },
    data: {
      organisationName: s(formData.get("organisationName")) || null,
      publicDisplayName: s(formData.get("publicDisplayName")) || null,
      website: s(formData.get("website")) || null,
      email: s(formData.get("email")) || null,
      showEmailPublicly: formData.get("showEmailPublicly") === "on",
      phone: s(formData.get("phone")) || null,
      serviceArea: s(formData.get("serviceArea")) || null,
      registrationNumber: s(formData.get("registrationNumber")) || null,
      charityNumber: s(formData.get("charityNumber")) || null,
      insuranceDetails: s(formData.get("insuranceDetails")) || null,
      qualifications: s(formData.get("qualifications")) || null,
      professionalCategory: professionalCategory(formData.get("professionalCategory")),
      breeds: s(formData.get("breeds")) || null,
      description: s(formData.get("description")) || null,
      evidenceNotes: s(formData.get("evidenceNotes")) || null,
    },
  });
  revalidatePath(`/account/applications/${id}`);
}

export async function submitApplication(formData: FormData) {
  const user = await requireUser();
  const id = s(formData.get("applicationId"));
  const app = await editable(id, user.id);
  if (!app.publicDisplayName && !app.organisationName) throw new Error("Public or organisation name is required");
  await prisma.roleApplication.update({ where: { id }, data: { status: "SUBMITTED", submittedAt: new Date(), rejectionReason: null } });
  revalidatePath("/account");
  redirect("/account");
}

export async function withdrawApplication(formData: FormData) {
  const user = await requireUser();
  const id = s(formData.get("applicationId"));
  await prisma.roleApplication.updateMany({ where: { id, userId: user.id, status: { in: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "REJECTED"] as RoleApplicationStatus[] } }, data: { status: "WITHDRAWN" } });
  revalidatePath("/account");
  redirect("/account");
}
