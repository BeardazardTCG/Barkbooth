"use server";

import type { CompetitionEligibility, CompetitionEntryStatus, CompetitionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { canTransitionCompetition, competitionAcceptsEntries, competitionCountryEligibility, competitionOpenNowDates, parseBoundedInteger, parsePoundsToPence } from "@/lib/competitions";
import { prisma } from "@/lib/prisma";
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
  if (competition.entryFeePence > 0) return { status: "error", message: "Paid entries are not available yet." };
  if (!competitionCountryEligibility(competition.eligibility, user.country)) return { status: "error", message: "Initial physical-prize competitions are UK-only. Profiles and external evidence remain available internationally." };
  if (!dog) return { status: "error", message: "You may only enter a dog registered to your account." };
  if (!dog.name || !dog.sex) return { status: "error", message: "A dog name and sex are required for a Bark Booth identity." };
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
        profileCompleteness: 100,
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
    slug: value(form, "slug"), title: value(form, "title"), theme: value(form, "theme"), tagline: value(form,"tagline") || null, description: value(form, "description"),
    status, opensAt, closesAt, eligibility, entryFeePence: parsePoundsToPence(value(form,"entryFeePounds") || "0", "Entry fee", 100_000)!,
    launchMessage: value(form,"launchMessage") || null, heroAltText: value(form,"heroAltText") || null,
    heroFocalPosition: ["top","center","bottom"].includes(value(form,"heroFocalPosition")) ? value(form,"heroFocalPosition") : "center",
    judgingCriteria: value(form,"judgingCriteria") || null, galleryVisible: form.get("galleryVisible") === "on",
    maxEntriesPerDog: parseBoundedInteger(value(form, "maxEntriesPerDog"), "Maximum entries per dog", 1, 20),
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
    if (to === "OPEN" && competition.entryFeePence > 0) throw new Error("Paid competitions cannot open until payment processing is connected.");
    const now = new Date();
    const openDates = to === "OPEN" ? competitionOpenNowDates(competition.opensAt, competition.closesAt, now) : {};
    await tx.competition.update({ where: { id }, data: to === "CANCELLED"
      ? { status: to, cancelledAt: now, cancelledById: admin.id, cancellationReason: reason }
      : { status: to, ...openDates, ...(competition.status === "CANCELLED" ? { cancelledAt: null, cancelledById: null, cancellationReason: null } : {}) } });
  });
  const slug = await prisma.competition.findUniqueOrThrow({where:{id},select:{slug:true}});
  revalidatePath("/competitions"); revalidatePath(`/competitions/${slug.slug}`); revalidatePath(`/admin/competitions/${id}`);
}

export async function savePrize(formData: FormData) {
  await requireAdmin(); const competitionId=value(formData,"competitionId"), id=value(formData,"prizeId");
  const description=value(formData,"description"), placement=value(formData,"placement");
  if(!description || !placement) throw new Error("Prize placement and description are required.");
  const pounds=value(formData,"valuePounds"), imageUrl=value(formData,"imageUrl");
  if (imageUrl) { let parsed: URL; try { parsed = new URL(imageUrl); } catch { throw new Error("Prize image must be a valid HTTPS URL."); } if (parsed.protocol !== "https:") throw new Error("Prize image must use HTTPS."); }
  const data={placement,title:value(formData,"title")||null,description,valuePence:parsePoundsToPence(pounds,"Estimated prize value",10_000_000,true),sponsor:value(formData,"sponsor")||null,imageUrl:imageUrl||null,digitalAward:value(formData,"digitalAward")||null,displayOrder:parseBoundedInteger(value(formData,"displayOrder")||"0","Prize display order",0,1000)};
  if(id){const prize=await prisma.competitionPrize.findFirst({where:{id,competitionId}});if(!prize)throw new Error("Prize not found.");await prisma.competitionPrize.update({where:{id},data});}else await prisma.competitionPrize.create({data:{competitionId,...data}});
  const competition=await prisma.competition.findUniqueOrThrow({where:{id:competitionId},select:{slug:true}});
  revalidatePath(`/admin/competitions/${competitionId}`); revalidatePath(`/competitions/${competition.slug}`); revalidatePath("/competitions");
}
export async function removePrize(formData: FormData) { await requireAdmin(); if(formData.get("confirmRemove")!=="on") throw new Error("Confirm prize removal."); const id=value(formData,"prizeId"),competitionId=value(formData,"competitionId"); const prize=await prisma.competitionPrize.findFirst({where:{id,competitionId},include:{competition:{select:{slug:true}}}});if(!prize)throw new Error("Prize not found.");await prisma.competitionPrize.delete({where:{id}});revalidatePath(`/admin/competitions/${competitionId}`);revalidatePath(`/competitions/${prize.competition.slug}`);revalidatePath("/competitions"); }

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

export async function saveJudge(formData: FormData){await requireAdmin();const competitionId=value(formData,"competitionId"),id=value(formData,"judgeId"),name=value(formData,"name");if(!name)throw new Error("Judge name is required.");const data={name,roleTitle:value(formData,"roleTitle")||null,organisation:value(formData,"organisation")||null,biography:value(formData,"biography")||null,profession:value(formData,"profession")||null,judgingFocus:value(formData,"judgingFocus")||null,guestJudge:formData.get("guestJudge")==="on",displayOrder:Number(value(formData,"displayOrder")||0)};if(id){const judge=await prisma.competitionJudge.findFirst({where:{id,competitionId}});if(!judge)throw new Error("Judge not found.");await prisma.competitionJudge.update({where:{id},data})}else await prisma.competitionJudge.create({data:{competitionId,...data}});revalidatePath(`/admin/competitions/${competitionId}`)}
export async function removeJudge(formData: FormData){await requireAdmin();const id=value(formData,"judgeId"),competitionId=value(formData,"competitionId");const judge=await prisma.competitionJudge.findFirst({where:{id,competitionId},include:{competition:true}});if(!judge)throw new Error("Judge not found.");await prisma.competitionJudge.delete({where:{id}});if(judge.imageStorageKey)await deleteObject(judge.imageStorageKey).catch(error=>console.error("Judge image cleanup failed",{error}));revalidatePath(`/admin/competitions/${competitionId}`);revalidatePath(`/competitions/${judge.competition.slug}`)}
export async function uploadCompetitionHero(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "competitionId");
  const competition = await prisma.competition.findUnique({ where: { id } });
  if (!competition) throw new Error("Competition not found.");
  const { file, bytes } = await validateUpload(formData.get("hero"), imageContentTypes, MAX_PROFILE_PHOTO_BYTES);
  const key = storageKey(`competitions/${id}/hero`, file.type);
  await putObject(key, bytes, file.type);
  try {
    await prisma.competition.update({ where: { id }, data: { heroStorageKey: key, heroFileName: file.name, heroContentType: file.type, heroSizeBytes: file.size } });
  } catch (error) {
    await deleteObject(key).catch((cleanupError) => console.error("Hero rollback cleanup failed", { error: cleanupError }));
    throw error;
  }
  // Next 14 in this deployment has no guaranteed post-response task primitive.
  // Await best-effort cleanup so a successful response never abandons old media.
  if (competition.heroStorageKey) await deleteObject(competition.heroStorageKey).catch((error) => console.error("Hero cleanup failed", { error }));
  revalidatePath(`/competitions/${competition.slug}`);
}
export async function removeCompetitionHero(formData:FormData){await requireAdmin();const id=value(formData,"competitionId"),competition=await prisma.competition.findUniqueOrThrow({where:{id}});await prisma.competition.update({where:{id},data:{heroStorageKey:null,heroFileName:null,heroContentType:null,heroSizeBytes:null}});if(competition.heroStorageKey)await deleteObject(competition.heroStorageKey).catch(error=>console.error("Hero cleanup failed",{error}));revalidatePath(`/competitions/${competition.slug}`);revalidatePath(`/admin/competitions/${id}`)}

export async function uploadJudgeImage(formData: FormData) {
  await requireAdmin(); const judgeId = value(formData, "judgeId"), competitionId = value(formData, "competitionId");
  const judge = await prisma.competitionJudge.findFirst({ where: { id: judgeId, competitionId }, include: { competition: true } }); if (!judge) throw new Error("Judge not found.");
  const { file, bytes } = await validateUpload(formData.get("image"), imageContentTypes, MAX_PROFILE_PHOTO_BYTES); const key = storageKey(`competitions/${competitionId}/judges/${judgeId}`, file.type); await putObject(key, bytes, file.type);
  try { await prisma.competitionJudge.update({ where: { id: judgeId }, data: { imageStorageKey: key, imageFileName: file.name, imageContentType: file.type, imageSizeBytes: file.size } }); } catch (error) { await deleteObject(key).catch(() => undefined); throw error; }
  if (judge.imageStorageKey) await deleteObject(judge.imageStorageKey).catch(error => console.error("Judge image cleanup failed", { error })); revalidatePath(`/admin/competitions/${competitionId}`); revalidatePath(`/competitions/${judge.competition.slug}`);
}
export async function removeJudgeImage(formData: FormData) {
  await requireAdmin(); const judgeId = value(formData, "judgeId"), competitionId = value(formData, "competitionId"); const judge = await prisma.competitionJudge.findFirst({ where: { id: judgeId, competitionId }, include: { competition: true } }); if (!judge) throw new Error("Judge not found.");
  await prisma.competitionJudge.update({ where: { id: judgeId }, data: { imageStorageKey: null, imageFileName: null, imageContentType: null, imageSizeBytes: null } }); if (judge.imageStorageKey) await deleteObject(judge.imageStorageKey).catch(error => console.error("Judge image cleanup failed", { error })); revalidatePath(`/admin/competitions/${competitionId}`); revalidatePath(`/competitions/${judge.competition.slug}`);
}
