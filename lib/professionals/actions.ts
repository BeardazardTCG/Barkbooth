"use server";

import { revalidatePath } from "next/cache";
import type {
  ProfessionalAddressVisibility,
  ProfessionalEvidenceType,
  ProfessionalMediaKind,
  ProfessionalProfilePublicationStatus,
  ProfessionalProfileVerificationStatus,
  ServiceRadiusUnit,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { isSupportedLocation } from "@/lib/locations";
import { professionalTypes, validateServices, slugify } from "@/lib/professionals/catalog";
import { validateEvidenceUrl } from "@/lib/evidence-links";
import { putObject, deleteObject } from "@/lib/storage";
import { imageContentTypes, documentContentTypes, MAX_PROFILE_PHOTO_BYTES, MAX_RECORD_DOCUMENT_BYTES, storageKey, validateUpload } from "@/lib/uploads";

const profileVerificationStatuses = ["NOT_SUBMITTED", "EVIDENCE_SUBMITTED", "UNDER_REVIEW", "VERIFIED", "REJECTED"] as const;
const publicationStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
const evidenceTypes = ["QUALIFICATION", "INSURANCE", "LICENCE", "MEMBERSHIP", "FIRST_AID", "OTHER"] as const;
const mediaKinds = ["LOGO", "GALLERY"] as const;
const addressVisibilities = ["FULL_ADDRESS", "TOWN_AREA_ONLY", "SERVICE_AREA_ONLY"] as const;
const radiusUnits = ["MILES", "KILOMETRES"] as const;
const allowedPublicationTransitions: Record<ProfessionalProfilePublicationStatus, ProfessionalProfilePublicationStatus[]> = {
  DRAFT: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const s = (v: FormDataEntryValue | null) => typeof v === "string" ? v.trim() : "";
function asAllowed<T extends readonly string[]>(value: string, allowed: T, label: string): T[number] {
  if (!allowed.includes(value as T[number])) throw new Error(`Choose a valid ${label}.`);
  return value as T[number];
}
function optionalHttps(value: string) { return value ? validateEvidenceUrl(value) : null; }
function optionalDate(value: string) { return value ? new Date(`${value}T00:00:00.000Z`) : null; }
function intInRange(value: string, label: string, min: number, max: number, required = false) {
  if (!value) { if (required) throw new Error(`${label} is required.`); return null; }
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${label} must be between ${min} and ${max}.`);
  return n;
}
function bounded(value: string, label: string, max: number, required = false) {
  if (!value) { if (required) throw new Error(`${label} is required.`); return null; }
  if (value.length > max) throw new Error(`${label} is too long.`);
  return value;
}
function validTime(value: string) {
  if (!value) return null;
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) throw new Error("Opening hours must use HH:MM time values.");
  return value;
}
function minutes(value: string) { const [h, m] = value.split(":").map(Number); return h * 60 + m; }
function parseOpeningHours(form: FormData) {
  return days.map((_, dayOfWeek) => {
    const closed = form.get(`hours.${dayOfWeek}.closed`) === "on";
    const opensAt = validTime(s(form.get(`hours.${dayOfWeek}.opensAt`)));
    const closesAt = validTime(s(form.get(`hours.${dayOfWeek}.closesAt`)));
    const secondOpensAt = validTime(s(form.get(`hours.${dayOfWeek}.secondOpensAt`)));
    const secondClosesAt = validTime(s(form.get(`hours.${dayOfWeek}.secondClosesAt`)));
    if (closed) return { dayOfWeek, closed: true, opensAt: null, closesAt: null, secondOpensAt: null, secondClosesAt: null };
    if (!opensAt && !closesAt && !secondOpensAt && !secondClosesAt) return null;
    if (!opensAt || !closesAt) throw new Error(`${days[dayOfWeek]} needs both opening and closing times, or mark it closed.`);
    if (minutes(closesAt) <= minutes(opensAt)) throw new Error(`${days[dayOfWeek]} closing time must be after opening time.`);
    if (secondOpensAt || secondClosesAt) {
      if (!secondOpensAt || !secondClosesAt) throw new Error(`${days[dayOfWeek]} second period needs both opening and closing times.`);
      if (minutes(secondClosesAt) <= minutes(secondOpensAt)) throw new Error(`${days[dayOfWeek]} second closing time must be after second opening time.`);
      if (minutes(secondOpensAt) < minutes(closesAt)) throw new Error(`${days[dayOfWeek]} second period must not overlap the first period.`);
    }
    return { dayOfWeek, closed: false, opensAt, closesAt, secondOpensAt, secondClosesAt };
  }).filter(Boolean) as Array<{ dayOfWeek: number; closed: boolean; opensAt: string | null; closesAt: string | null; secondOpensAt: string | null; secondClosesAt: string | null }>;
}
async function uniqueSlug(name: string) {
  const base = slugify(name);
  for (let i = 0; i < 50; i++) {
    const slug = i ? `${base}-${i + 1}` : base;
    const found = await prisma.professionalProfile.findUnique({ where: { slug }, select: { id: true } });
    if (!found) return slug;
  }
  return `${base}-${Date.now()}`;
}
async function ownerProfile(id: string) {
  const user = await requireUser();
  const profile = await prisma.professionalProfile.findUnique({ where: { id } });
  if (!profile || profile.ownerUserId !== user.id) throw new Error("You can only manage Professional Profiles you own.");
  return { user, profile };
}
async function ownerMedia(mediaId: string) {
  const user = await requireUser();
  const media = await prisma.professionalProfileMedia.findUnique({ where: { id: mediaId }, include: { profile: true } });
  if (!media || media.profile.ownerUserId !== user.id) throw new Error("You can only manage media for Professional Profiles you own.");
  return { user, media };
}
async function ownerEvidence(evidenceId: string) {
  const user = await requireUser();
  const evidence = await prisma.professionalProfileEvidence.findUnique({ where: { id: evidenceId }, include: { profile: true } });
  if (!evidence || evidence.profile.ownerUserId !== user.id) throw new Error("You can only manage evidence for Professional Profiles you own.");
  return { user, evidence };
}
function publicationMinimum(profile: { businessName: string; type: string; shortDescription: string; email: string | null; phone: string | null; website: string | null; mobileBusiness: boolean; townCity: string | null; country: string }) {
  return Boolean(profile.businessName && professionalTypes.includes(profile.type as never) && profile.shortDescription && profile.shortDescription !== "Draft profile awaiting description." && (profile.email || profile.phone || profile.website) && (profile.mobileBusiness || profile.townCity || profile.country));
}
function profileStatusAfterEvidence(current: ProfessionalProfileVerificationStatus) {
  return current === "NOT_SUBMITTED" ? "EVIDENCE_SUBMITTED" : current;
}

function revalidateProfessionalSurfaces(profile: { id: string; slug: string }, admin = false) {
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/professionals/${profile.id}`);
  revalidatePath("/professionals");
  revalidatePath(`/professionals/${profile.slug}`);
  if (admin) revalidatePath("/admin/professionals");
}
async function bestEffortDeleteObject(key: string, operation: string) {
  await deleteObject(key).catch((error) => console.error("Professional Profile storage cleanup failed", { operation, storageKey: key, error }));
}
async function rollbackUploadedObject(key: string, operation: string) {
  await deleteObject(key).catch((error) => console.error("Professional Profile upload rollback cleanup failed", { operation, storageKey: key, error }));
}
function publicationTimestampData(to: ProfessionalProfilePublicationStatus) {
  if (to === "PUBLISHED") return { publishedAt: new Date(), archivedAt: null, archiveReason: null };
  if (to === "DRAFT") return { publishedAt: null, archivedAt: null, archiveReason: null };
  return { archivedAt: new Date() };
}

export async function saveProfessionalProfile(form: FormData) {
  const user = await requireUser();
  const id = s(form.get("profileId"));
  const type = asAllowed(s(form.get("type")) || "OTHER", professionalTypes, "professional type");
  const businessName = bounded(s(form.get("businessName")), "Business name", 160, true)!;
  const shortDescription = bounded(s(form.get("shortDescription")), "Short description", 600, true) || "Draft profile awaiting description.";
  const customType = type === "OTHER" ? bounded(s(form.get("customType")), "Custom professional type", 80, true) : null;
  const yearEstablished = intInRange(s(form.get("yearEstablished")), "Year established", 1800, new Date().getUTCFullYear());
  const email = bounded(s(form.get("email")), "Business email", 254);
  const phone = bounded(s(form.get("phone")), "Phone", 60);
  const country = s(form.get("country"));
  if (!isSupportedLocation(country)) throw new Error("Choose a supported country.");
  const serviceRadiusUnit = asAllowed(s(form.get("serviceRadiusUnit")) || "MILES", radiusUnits, "service radius unit") as ServiceRadiusUnit;
  const mobileBusiness = form.get("mobileBusiness") === "on";
  const serviceRadiusValue = intInRange(s(form.get("serviceRadiusValue")), "Service radius", 1, 500, false);
  if (serviceRadiusValue && !mobileBusiness) throw new Error("Service radius is only used for mobile businesses.");
  const addressVisibility = asAllowed(s(form.get("addressVisibility")) || "TOWN_AREA_ONLY", addressVisibilities, "address visibility") as ProfessionalAddressVisibility;
  const servicesRaw = form.getAll("services").map(s).filter(Boolean);
  const services = validateServices(type, servicesRaw);
  if (services.length !== servicesRaw.length) throw new Error("Some selected services do not match the chosen professional type.");
  const otherService = bounded(s(form.get("otherService")), "Other service", 160);
  const openingHours = parseOpeningHours(form);
  const data = {
    type,
    customType,
    businessName,
    shortDescription,
    yearEstablished,
    email,
    phone,
    website: optionalHttps(s(form.get("website"))),
    facebookUrl: optionalHttps(s(form.get("facebookUrl"))),
    instagramUrl: optionalHttps(s(form.get("instagramUrl"))),
    addressLine1: bounded(s(form.get("addressLine1")), "Address line 1", 200),
    addressLine2: bounded(s(form.get("addressLine2")), "Address line 2", 200),
    townCity: bounded(s(form.get("townCity")), "Town/city", 120),
    regionCounty: bounded(s(form.get("regionCounty")), "Region/county", 120),
    postcode: bounded(s(form.get("postcode")), "Postcode", 40),
    country,
    mobileBusiness,
    serviceRadiusValue,
    serviceRadiusUnit,
    addressVisibility,
    hoursNote: bounded(s(form.get("hoursNote")), "Opening hours note", 1000),
    appointmentOnly: form.get("appointmentOnly") === "on",
  };
  const serviceCreates = [...services.map((label) => ({ serviceKey: slugify(label), label })), ...(otherService ? [{ serviceKey: `other-${slugify(otherService)}`, label: otherService, isOther: true }] : [])];
  const saved = id ? await ownerProfile(id).then(({ profile }) => prisma.professionalProfile.update({
    where: { id: profile.id },
    data: { ...data, services: { deleteMany: {}, create: serviceCreates }, openingHours: { deleteMany: {}, create: openingHours }, audits: { create: { actorUserId: user.id, action: "OWNER_SAVE" } } },
  })) : await prisma.professionalProfile.create({
    data: { ownerUserId: user.id, slug: await uniqueSlug(businessName), ...data, services: { create: serviceCreates }, openingHours: { create: openingHours }, audits: { create: { actorUserId: user.id, action: "OWNER_CREATE" } } },
  });
  revalidateProfessionalSurfaces(saved);
}

export async function setProfessionalPublication(form: FormData) {
  const { user, profile } = await ownerProfile(s(form.get("profileId")));
  const to = asAllowed(s(form.get("to")), publicationStatuses, "publication status") as ProfessionalProfilePublicationStatus;
  if (!allowedPublicationTransitions[profile.publicationStatus].includes(to)) throw new Error("That publication change is not allowed.");
  if (to === "PUBLISHED" && !publicationMinimum(profile)) throw new Error("Add a real description, contact method and safe location/service area before publishing.");
  const data: Record<string, unknown> = { publicationStatus: to, ...publicationTimestampData(to) };
  if (to === "ARCHIVED") data.archiveReason = bounded(s(form.get("reason")), "Archive reason", 500, true);
  await prisma.professionalProfile.update({ where: { id: profile.id }, data: { ...data, audits: { create: { actorUserId: user.id, action: `PUBLICATION_${to}`, reason: data.archiveReason as string | undefined } } } });
  revalidateProfessionalSurfaces(profile);
}

export async function addProfessionalEvidence(form: FormData) {
  const { user, profile } = await ownerProfile(s(form.get("profileId")));
  const evidenceType = asAllowed(s(form.get("evidenceType")), evidenceTypes, "evidence type") as ProfessionalEvidenceType;
  const publicUrl = s(form.get("publicUrl"));
  let upload: { storageKey: string; fileName: string; contentType: string; sizeBytes: number } | null = null;
  const raw = form.get("document");
  if (raw instanceof File && raw.name && raw.size) {
    const { file, bytes } = await validateUpload(raw, documentContentTypes, MAX_RECORD_DOCUMENT_BYTES);
    upload = { storageKey: storageKey(`professionals/${profile.id}/evidence`, file.type), fileName: file.name, contentType: file.type, sizeBytes: file.size };
    await putObject(upload.storageKey, bytes, file.type);
  }
  try {
    await prisma.$transaction(async (tx) => {
      await tx.professionalProfileEvidence.create({ data: {
        profileId: profile.id,
        evidenceType,
        title: bounded(s(form.get("title")), "Evidence title", 160, true)!,
        issuerProvider: bounded(s(form.get("issuerProvider")), "Issuer/provider", 160),
        referenceNumber: bounded(s(form.get("referenceNumber")), "Reference number", 160),
        expiryDate: optionalDate(s(form.get("expiryDate"))),
        publicUrl: publicUrl ? optionalHttps(publicUrl) : null,
        publicUrlVisible: form.get("publicUrlVisible") === "on",
        ownerNotes: bounded(s(form.get("ownerNotes")), "Owner notes", 2000),
        ...(upload ?? {}),
      } });
      await tx.professionalProfile.update({ where: { id: profile.id }, data: { verificationStatus: profileStatusAfterEvidence(profile.verificationStatus), audits: { create: { actorUserId: user.id, action: "EVIDENCE_SUBMITTED" } } } });
    });
  } catch (error) {
    if (upload) await rollbackUploadedObject(upload.storageKey, "rollbackProfessionalEvidenceUpload");
    throw error;
  }
  revalidateProfessionalSurfaces(profile);
}

export async function updateProfessionalEvidence(form: FormData) {
  const { evidence } = await ownerEvidence(s(form.get("evidenceId")));
  const evidenceType = asAllowed(s(form.get("evidenceType")), evidenceTypes, "evidence type") as ProfessionalEvidenceType;
  const publicUrl = s(form.get("publicUrl"));
  await prisma.professionalProfileEvidence.update({ where: { id: evidence.id }, data: {
    evidenceType,
    title: bounded(s(form.get("title")), "Evidence title", 160, true)!,
    issuerProvider: bounded(s(form.get("issuerProvider")), "Issuer/provider", 160),
    referenceNumber: bounded(s(form.get("referenceNumber")), "Reference number", 160),
    expiryDate: optionalDate(s(form.get("expiryDate"))),
    publicUrl: publicUrl ? optionalHttps(publicUrl) : null,
    publicUrlVisible: form.get("publicUrlVisible") === "on",
    ownerNotes: bounded(s(form.get("ownerNotes")), "Owner notes", 2000),
  } });
  revalidateProfessionalSurfaces(evidence.profile);
}

export async function replaceProfessionalEvidenceDocument(form: FormData) {
  const { evidence } = await ownerEvidence(s(form.get("evidenceId")));
  const { file, bytes } = await validateUpload(form.get("document"), documentContentTypes, MAX_RECORD_DOCUMENT_BYTES);
  const next = { storageKey: storageKey(`professionals/${evidence.profileId}/evidence`, file.type), fileName: file.name, contentType: file.type, sizeBytes: file.size };
  await putObject(next.storageKey, bytes, file.type);
  const oldKey = evidence.storageKey;
  try {
    await prisma.professionalProfileEvidence.update({ where: { id: evidence.id }, data: next });
  } catch (error) {
    await rollbackUploadedObject(next.storageKey, "rollbackProfessionalEvidenceDocumentReplacement");
    throw error;
  }
  if (oldKey) await bestEffortDeleteObject(oldKey, "replaceProfessionalEvidenceDocument");
  revalidateProfessionalSurfaces(evidence.profile);
}

export async function removeProfessionalEvidenceDocument(form: FormData) {
  const { evidence } = await ownerEvidence(s(form.get("evidenceId")));
  if (!evidence.storageKey) return;
  await prisma.professionalProfileEvidence.update({ where: { id: evidence.id }, data: { storageKey: null, fileName: null, contentType: null, sizeBytes: null } });
  await bestEffortDeleteObject(evidence.storageKey, "removeProfessionalEvidenceDocument");
  revalidateProfessionalSurfaces(evidence.profile);
}

export async function removeProfessionalEvidence(form: FormData) {
  const { evidence } = await ownerEvidence(s(form.get("evidenceId")));
  await prisma.professionalProfileEvidence.delete({ where: { id: evidence.id } });
  if (evidence.storageKey) await bestEffortDeleteObject(evidence.storageKey, "removeProfessionalEvidence");
  revalidateProfessionalSurfaces(evidence.profile);
}

export async function uploadProfessionalImage(form: FormData) {
  const { profile } = await ownerProfile(s(form.get("profileId")));
  const kind = asAllowed(s(form.get("kind")) || "LOGO", mediaKinds, "media kind") as ProfessionalMediaKind;
  const displayOrder = intInRange(s(form.get("displayOrder")), "Display order", 0, 1000) ?? 0;
  if (kind === "GALLERY") {
    const count = await prisma.professionalProfileMedia.count({ where: { profileId: profile.id, kind: "GALLERY", active: true } });
    if (count >= 10) throw new Error("A Professional Profile can have up to 10 gallery images.");
  }
  const { file, bytes } = await validateUpload(form.get("image"), imageContentTypes, MAX_PROFILE_PHOTO_BYTES);
  const key = storageKey(`professionals/${profile.id}/${kind.toLowerCase()}`, file.type);
  await putObject(key, bytes, file.type);
  let oldKey: string | null = null;
  try {
    await prisma.$transaction(async (tx) => {
      if (kind === "LOGO") {
        const previous = await tx.professionalProfileMedia.findFirst({ where: { profileId: profile.id, kind: "LOGO", active: true }, select: { id: true, storageKey: true } });
        await tx.professionalProfileMedia.create({ data: { profileId: profile.id, kind, storageKey: key, fileName: file.name, contentType: file.type, sizeBytes: file.size, displayOrder, altText: bounded(s(form.get("altText")), "Alt text", 240) } });
        if (previous) { oldKey = previous.storageKey; await tx.professionalProfileMedia.update({ where: { id: previous.id }, data: { active: false } }); }
      } else {
        await tx.professionalProfileMedia.create({ data: { profileId: profile.id, kind, storageKey: key, fileName: file.name, contentType: file.type, sizeBytes: file.size, displayOrder, altText: bounded(s(form.get("altText")), "Alt text", 240) } });
      }
    });
  } catch (error) {
    await rollbackUploadedObject(key, "rollbackProfessionalImageUpload");
    throw error;
  }
  if (oldKey) await bestEffortDeleteObject(oldKey, "replaceProfessionalLogo");
  revalidateProfessionalSurfaces(profile);
}

export async function updateProfessionalMedia(form: FormData) {
  const { media } = await ownerMedia(s(form.get("mediaId")));
  await prisma.professionalProfileMedia.update({ where: { id: media.id }, data: { altText: bounded(s(form.get("altText")), "Alt text", 240), displayOrder: intInRange(s(form.get("displayOrder")), "Display order", 0, 1000) ?? media.displayOrder } });
  revalidateProfessionalSurfaces(media.profile);
}

export async function removeProfessionalMedia(form: FormData) {
  const { media } = await ownerMedia(s(form.get("mediaId")));
  await prisma.professionalProfileMedia.update({ where: { id: media.id }, data: { active: false } });
  await bestEffortDeleteObject(media.storageKey, "removeProfessionalMedia");
  revalidateProfessionalSurfaces(media.profile);
}

export async function reviewProfessionalProfile(form: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("ADMIN access required.");
  const status = asAllowed(s(form.get("verificationStatus")), profileVerificationStatuses, "profile verification status") as ProfessionalProfileVerificationStatus;
  const profile = await prisma.professionalProfile.update({ where: { id: s(form.get("profileId")) }, data: {
    verificationStatus: status,
    verificationNotes: bounded(s(form.get("verificationNotes")), "Owner-visible verification note", 2000),
    adminReviewNotes: bounded(s(form.get("adminReviewNotes")), "Admin review note", 2000),
    reviewedById: user.id,
    reviewedAt: new Date(),
    audits: { create: { actorUserId: user.id, action: `ADMIN_PROFILE_${status}`, reason: s(form.get("adminReviewNotes")) || null } },
  } });
  revalidateProfessionalSurfaces(profile, true);
}

export async function reviewProfessionalEvidence(form: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("ADMIN access required.");
  const status = asAllowed(s(form.get("verificationStatus")), profileVerificationStatuses, "evidence verification status") as ProfessionalProfileVerificationStatus;
  const evidenceId = s(form.get("evidenceId"));
  const evidence = await prisma.professionalProfileEvidence.findUnique({ where: { id: evidenceId }, include: { profile: true } });
  if (!evidence) throw new Error("Evidence not found.");
  await prisma.$transaction(async (tx) => {
    await tx.professionalProfileEvidence.update({ where: { id: evidenceId }, data: { verificationStatus: status, adminReviewNotes: bounded(s(form.get("adminReviewNotes")), "Admin review note", 2000), reviewedById: user.id, reviewedAt: new Date() } });
    await tx.professionalProfileAudit.create({ data: { profileId: evidence.profileId, actorUserId: user.id, action: `ADMIN_EVIDENCE_${status}`, reason: s(form.get("adminReviewNotes")) || null } });
  });
  revalidateProfessionalSurfaces(evidence.profile, true);
}

export async function adminSetProfessionalPublication(form: FormData) {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("ADMIN access required.");
  const profile = await prisma.professionalProfile.findUnique({ where: { id: s(form.get("profileId")) } });
  if (!profile) throw new Error("Profile not found.");
  const to = asAllowed(s(form.get("to")), publicationStatuses, "publication status") as ProfessionalProfilePublicationStatus;
  if (!allowedPublicationTransitions[profile.publicationStatus].includes(to)) throw new Error("That publication change is not allowed.");
  const reason = to === "ARCHIVED" ? bounded(s(form.get("reason")), "Archive reason", 500, true) : bounded(s(form.get("reason")), "Review reason", 500);
  const timestampData: Record<string, unknown> = { ...publicationTimestampData(to) };
  if (to === "ARCHIVED") timestampData.archiveReason = reason;
  const updated = await prisma.professionalProfile.update({ where: { id: profile.id }, data: { publicationStatus: to, ...timestampData, audits: { create: { actorUserId: user.id, action: `ADMIN_PUBLICATION_${to}`, reason } } } });
  revalidateProfessionalSurfaces(updated, true);
}
