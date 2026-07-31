"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { competitionAcceptsEntries, competitionCountryEligibility } from "@/lib/competitions";
import { calculateDogProfileCompleteness } from "@/lib/profile-completeness";
import { imageContentTypes, MAX_PROFILE_PHOTO_BYTES, storageKey, validateUpload } from "@/lib/uploads";
import { deleteObject, putObject } from "@/lib/storage";
import type { ActionResult } from "@/lib/forms/action-result";

const value = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
async function requireAdmin() { const user = await requireUser(); if (user.role !== "ADMIN") throw new Error("Administrator access required."); return user; }
export async function enterCompetition(_previous: ActionResult, form: FormData): Promise<ActionResult> {
  const user = await requireUser(); const competitionId = value(form,"competitionId"); const dogId = value(form,"dogId");
  const [competition, dog] = await Promise.all([prisma.competition.findUnique({where:{id:competitionId},include:{entries:{where:{dogId,status:{notIn:["WITHDRAWN","DISQUALIFIED"]}}}}}), prisma.dogIdentity.findFirst({where:{id:dogId,ownerships:{some:{userId:user.id}}},include:{records:true,behaviourLifestyle:true,profilePhoto:true}})]);
  if (!competition || !(competitionAcceptsEntries(competition.status, competition.opensAt, competition.closesAt) || (user.role === "ADMIN" && competition.status === "DRAFT"))) return {status:"error",message:"This competition is not open for entry."};
  if (!competitionCountryEligibility(competition.eligibility,user.country)) return {status:"error",message:"Initial physical-prize competitions are UK-only. Profiles and external evidence remain available internationally."};
  if (!dog) return {status:"error",message:"You may only enter a dog registered to your account."};
  if (!dog.profilePhoto || calculateDogProfileCompleteness(dog).percentage < 65) return {status:"error",message:"Complete the essential profile details and add a profile photo before entering."};
  if (competition.entries.length >= competition.maxEntriesPerDog) return {status:"error",message:"This dog has reached the maximum entries for this competition."};
  if (form.get("rulesAccepted") !== "on" || form.get("imageConsent") !== "on" || form.get("photoCompliance") !== "on") return {status:"error",message:"Accept the rules, photo guidelines and image-use consent to enter."};
  let uploaded: string | null = null;
  try { const {file,bytes}=await validateUpload(form.get("photo"),imageContentTypes,MAX_PROFILE_PHOTO_BYTES); uploaded=storageKey(`competitions/${competition.id}/entries`,file.type); await putObject(uploaded,bytes,file.type); const now=new Date(); await prisma.competitionEntry.create({data:{competitionId,dogId,submittedById:user.id,caption:value(form,"caption").slice(0,300)||null,storageKey:uploaded,fileName:file.name,contentType:file.type,sizeBytes:file.size,profileCompleteness:calculateDogProfileCompleteness(dog).percentage,rulesVersion:competition.rulesVersion,rulesAcceptedAt:now,imageUseConsentAt:now}}); }
  catch(error){ if(uploaded) await deleteObject(uploaded).catch(()=>undefined); return {status:"error",message:error instanceof Error?error.message:"The entry could not be saved."}; }
  revalidatePath("/competitions"); revalidatePath(`/competitions/${competition.slug}`); return {status:"success",message:"Competition entry submitted.",redirectTo:`/competitions/${competition.slug}`};
}
export async function saveCompetition(form: FormData) { await requireAdmin(); const id=value(form,"id"); const status=value(form,"status") as any; const data={slug:value(form,"slug"),title:value(form,"title"),theme:value(form,"theme"),description:value(form,"description"),status,opensAt:new Date(value(form,"opensAt")),closesAt:new Date(value(form,"closesAt")),eligibility:value(form,"eligibility") as any,entryFeePence:0,maxEntriesPerDog:Math.max(1,Number(value(form,"maxEntriesPerDog"))||1),prizeSummary:value(form,"prizeSummary"),rules:value(form,"rules"),rulesVersion:value(form,"rulesVersion")||"1",imageGuidelines:value(form,"imageGuidelines")}; if(data.closesAt<=data.opensAt) throw new Error("Closing date must follow opening date."); const competition=id?await prisma.competition.update({where:{id},data}):await prisma.competition.create({data}); revalidatePath("/competitions"); redirect(`/admin/competitions/${competition.id}`); }
export async function moderateEntry(form: FormData){ await requireAdmin(); const status=value(form,"status") as any; await prisma.competitionEntry.update({where:{id:value(form,"entryId")},data:{status,moderationReason:value(form,"reason")||null}}); revalidatePath("/competitions"); }
export async function publishResult(form: FormData){ await requireAdmin(); const competitionId=value(form,"competitionId"), entryId=value(form,"entryId"), now=new Date(); await prisma.$transaction([prisma.competitionResult.upsert({where:{competitionId_entryId:{competitionId,entryId}},create:{competitionId,entryId,placement:Number(value(form,"placement")),title:value(form,"title"),judgeNotes:value(form,"judgeNotes")||null,publishedAt:now},update:{placement:Number(value(form,"placement")),title:value(form,"title"),judgeNotes:value(form,"judgeNotes")||null,publishedAt:now}}),prisma.competition.update({where:{id:competitionId},data:{status:"COMPLETED",resultPublishedAt:now}})]); revalidatePath("/competitions"); }
