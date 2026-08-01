"use server";

import type { CompetitionEligibility, CompetitionEntryStatus, CompetitionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { canTransitionCompetition, competitionAcceptsEntries, competitionCountryEligibility, competitionOpenNowDates } from "@/lib/competitions";
import { prisma } from "@/lib/prisma";
import { calculateDogProfileCompleteness } from "@/lib/profile-completeness";
import { deleteObject, putObject } from "@/lib/storage";
import { imageContentTypes, MAX_PROFILE_PHOTO_BYTES, storageKey, validateUpload } from "@/lib/uploads";
import type { ActionResult } from "@/lib/forms/action-result";

const competitionStatuses = new Set<CompetitionStatus>(["DRAFT", "PUBLISHED", "OPEN", "CLOSED", "JUDGING", "COMPLETED", "CANCELLED"]);
const competitionEligibilities = new Set<CompetitionEligibility>(["UK_ONLY", "INTERNATIONAL"]);
const moderationStatuses = new Set<CompetitionEntryStatus>(["SUBMITTED", "WITHDRAWN", "DISQUALIFIED", "FINALIST", "WINNER"]);

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") throw new Error("Administrator access required.");
  return user;
}

function acceptedForEntry(status: CompetitionStatus, opensAt: Date, closesAt: Date, isAdmin: boolean) {
  return competitionAcceptsEntries(status, opensAt, closesAt) || (isAdmin && status === "DRAFT");
}

export async function enterCompetition(_previous: ActionResult, form: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const competitionId = value(form, "competitionId");
  const dogId = value(form, "dogId");
  const competition = await prisma.competition.findUnique({ where: { id: competitionId } });
  const dog = await prisma.dogIdentity.findFirst({
    where: { id: dogId, ownerships: { some: { userId: user.id } } },
    include: { records: true, behaviourLifestyle: true, profilePhoto: true },
  });

  if (!competition || !acceptedForEntry(competition.status, competition.opensAt, competition.closesAt, user.role === "ADMIN")) return { status: "error", message: "This competition is not open for entry." };
  if (!competitionCountryEligibility(competition.eligibility, user.country)) return { status: "error", message: "Initial physical-prize competitions are UK-only. Profiles and external evidence remain available internationally." };
  if (!dog) return { status: "error", message: "You may only enter a dog registered to your account." };
  const completeness = calculateDogProfileCompleteness(dog).percentage;
  if (!dog.profilePhoto || completeness < 65) return { status: "error", message: "Complete the essential profile details and add a profile photo before entering." };
  if (form.get("rulesAccepted") !== "on" || form.get("imageConsent") !== "on" || form.get("photoCompliance") !== "on") return { status: "error", message: "Accept the rules, photo guidelines and image-use consent to enter." };

  let uploadedKey: string | null = null;
  try {
    const { file, bytes } = await validateUpload(form.get("photo"), imageContentTypes, MAX_PROFILE_PHOTO_BYTES);
    uploadedKey = storageKey(`competitions/${competition.id}/entries`, file.type);
    await putObject(uploadedKey, bytes, file.type);
    const now = new Date();

    // The serializable transaction makes the entry-limit check authoritative even
    // when two uploads for the same dog finish at the same time.
    await prisma.$transaction(async (tx) => {
      const currentCompetition = await tx.competition.findUniqueOrThrow({ where: { id: competitionId } });
      if (!acceptedForEntry(currentCompetition.status, currentCompetition.opensAt, currentCompetition.closesAt, user.role === "ADMIN")) throw new Error("This competition is no longer open for entry.");
      const currentCount = await tx.competitionEntry.count({ where: { competitionId, dogId, status: { notIn: ["WITHDRAWN", "DISQUALIFIED"] } } });
      if (currentCount >= currentCompetition.maxEntriesPerDog) throw new Error("This dog has reached the maximum entries for this competition.");
      await tx.competitionEntry.create({ data: {
        competitionId,
        dogId,
        submittedById: user.id,
        caption: value(form, "caption").slice(0, 300) || null,
        storageKey: uploadedKey!,
        fileName: file.name,
        contentType: file.type,
        sizeBytes: file.size,
        profileCompleteness: completeness,
        rulesVersion: currentCompetition.rulesVersion,
        rulesAcceptedAt: now,
        imageUseConsentAt: now,
      } });
    }, { isolationLevel: "Serializable" });
  } catch (error) {
    if (uploadedKey) await deleteObject(uploadedKey).catch(() => undefined);
    return { status: "error", message: error instanceof Error ? error.message : "The entry could not be saved." };
  }

  revalidatePath("/competitions");
  revalidatePath(`/competitions/${competition.slug}`);
  return { status: "success", message: "Competition entry submitted.", redirectTo: `/competitions/${competition.slug}` };
}

export async function saveCompetition(form: FormData) {
  await requireAdmin();
  const id = value(form, "id");
  const existing = id ? await prisma.competition.findUnique({ where: { id }, include: { _count: { select: { entries: true } } } }) : null;
  const status = existing?.status ?? "DRAFT";
  const eligibility = value(form, "eligibility") as CompetitionEligibility;
  if (!competitionStatuses.has(status) || !competitionEligibilities.has(eligibility)) throw new Error("Choose valid competition settings.");
  const opensAt = new Date(value(form, "opensAt"));
  const closesAt = new Date(value(form, "closesAt"));
  if (!Number.isFinite(opensAt.getTime()) || !Number.isFinite(closesAt.getTime()) || closesAt <= opensAt) throw new Error("Enter valid dates, with the closing date after the opening date.");
  const required = ["slug", "title", "theme", "description", "prizeSummary", "rules", "imageGuidelines"] as const;
  if (required.some((field) => !value(form, field))) throw new Error("Complete every required competition field.");
  const data = {
    slug: value(form, "slug"), title: value(form, "title"), theme: value(form, "theme"), description: value(form, "description"),
    status, opensAt, closesAt, eligibility, entryFeePence: 0,
    maxEntriesPerDog: Math.max(1, Number(value(form, "maxEntriesPerDog")) || 1),
    prizeSummary: value(form, "prizeSummary"), rules: value(form, "rules"), rulesVersion: value(form, "rulesVersion") || "1", imageGuidelines: value(form, "imageGuidelines"),
  };
  if (existing && existing._count.entries > 0 && data.maxEntriesPerDog < existing.maxEntriesPerDog) throw new Error("The entry limit cannot be reduced after entries exist; existing entries will never be silently invalidated.");
  const competition = id ? await prisma.competition.update({ where: { id }, data }) : await prisma.competition.create({ data });
  revalidatePath("/competitions");
  if (value(form, "intent") === "preview") redirect(`/competitions/${competition.slug}`);
  redirect(`/admin/competitions/${competition.id}`);
}

export async function transitionCompetition(form: FormData) {
  const admin = await requireAdmin();
  const id = value(form, "competitionId");
  const to = value(form, "to") as CompetitionStatus;
  const reason = value(form, "cancellationReason");
  if (!competitionStatuses.has(to)) throw new Error("Choose a valid competition state.");
  if (to === "CANCELLED" && !reason) throw new Error("A cancellation reason is required.");

  await prisma.$transaction(async (tx) => {
    const competition = await tx.competition.findUniqueOrThrow({ where: { id } });
    if (!canTransitionCompetition(competition.status, to)) throw new Error(`Changing ${competition.status} to ${to} is not allowed.`);
    const now = new Date();
    const openDates = to === "OPEN" ? competitionOpenNowDates(competition.opensAt, competition.closesAt, now) : {};
    await tx.competition.update({ where: { id }, data: to === "CANCELLED"
      ? { status: to, cancelledAt: now, cancelledById: admin.id, cancellationReason: reason }
      : { status: to, ...openDates, ...(competition.status === "CANCELLED" ? { cancelledAt: null, cancelledById: null, cancellationReason: null } : {}) } });
  });
  revalidatePath("/competitions"); revalidatePath(`/admin/competitions/${id}`); revalidatePath("/admin/competitions");
}

export async function moderateEntry(form: FormData) {
  await requireAdmin();
  const status = value(form, "status") as CompetitionEntryStatus;
  if (!moderationStatuses.has(status)) throw new Error("Choose a valid entry status.");
  const reason = value(form, "reason");
  if (["WITHDRAWN", "DISQUALIFIED"].includes(status) && !reason) throw new Error("A reason is required when withdrawing or disqualifying an entry.");
  const entry = await prisma.competitionEntry.update({ where: { id: value(form, "entryId") }, data: { status, moderationReason: reason || null } });
  revalidatePath("/competitions");
  revalidatePath(`/admin/competitions/${entry.competitionId}`);
}

export async function saveResult(form: FormData) {
  await requireAdmin();
  const competitionId = value(form, "competitionId");
  const entryId = value(form, "entryId");
  const placement = Number(value(form, "placement"));
  const title = value(form, "title");
  if (!Number.isInteger(placement) || placement < 1 || !title) throw new Error("Enter a valid placement and result title.");
  const entry = await prisma.competitionEntry.findFirst({ where: { id: entryId, competitionId, status: { in: ["FINALIST", "WINNER"] } } });
  if (!entry) throw new Error("Only a finalist or winner from this competition can receive a published result.");
  await prisma.competitionResult.upsert({
      where: { competitionId_entryId: { competitionId, entryId } },
      create: { competitionId, entryId, placement, title, judgeNotes: value(form, "judgeNotes") || null },
      update: { placement, title, judgeNotes: value(form, "judgeNotes") || null },
    });
  revalidatePath(`/admin/competitions/${competitionId}`);
}

export async function publishResults(form: FormData) {
  await requireAdmin(); const competitionId=value(form,"competitionId");
  const competition=await prisma.competition.findUniqueOrThrow({where:{id:competitionId},include:{results:true}});
  if (competition.status !== "JUDGING" || !competition.results.length) throw new Error("Move to judging and save at least one placement before publishing results.");
  const now=new Date(); await prisma.$transaction([
    prisma.competitionResult.updateMany({where:{competitionId},data:{publishedAt:now}}),
    prisma.competition.update({where:{id:competitionId},data:{status:"COMPLETED",resultPublishedAt:now}}),
  ]);
  revalidatePath("/competitions");
  revalidatePath(`/admin/competitions/${competitionId}`);
}
