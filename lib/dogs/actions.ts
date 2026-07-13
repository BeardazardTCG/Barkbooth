"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function registryNumber(sequence: number) {
  return `BB-${sequence.toString().padStart(6, "0")}`;
}

const neuteredSpayedAnswers = ["YES", "NO", "UNKNOWN"] as const;

export async function registerDog(_prevState: string | null, formData: FormData) {
  const user = await requireUser();
  const name = asString(formData.get("name"));
  if (!name) return "Dog name is required.";

  const dogTypes = Array.from(new Set(formData.getAll("dogTypes").map((value) => asString(value)).filter(Boolean)));
  const primaryRole = dogTypes[0] ?? "Pet";

  const dateOfBirth = asString(formData.get("dateOfBirth"));
  const allowedVisibility = ["PUBLIC", "PRIVATE", "LINK_ONLY"] as const;
  const visibilityValue = asString(formData.get("visibility"));
  const neuteredSpayedValue = asString(formData.get("neuteredSpayed"));

  const dog = await prisma.$transaction(async (tx) => {
    const created = await tx.dogIdentity.create({
      data: {
        registryNumber: "PENDING",
        name,
        primaryRole,
        kennelClubName: asString(formData.get("kennelClubName")) || null,
        breed: asString(formData.get("breed")) || null,
        isMixedBreed: formData.get("isMixedBreed") === "on" || asString(formData.get("breed")) === "Mixed Breed",
        breedMix: formData.getAll("breedMix").map((value) => asString(value)).filter(Boolean).join(", ") || null,
        dnaConfirmed: asString(formData.get("dnaConfirmed")) || null,
        dogTypes: dogTypes.join(", ") || null,
        neuteredSpayed: neuteredSpayedAnswers.includes(neuteredSpayedValue as (typeof neuteredSpayedAnswers)[number]) ? neuteredSpayedValue : "UNKNOWN",
        dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00.000Z`) : null,
        estimatedDob: formData.get("estimatedDob") === "on",
        sex: asString(formData.get("sex")) || null,
        colour: asString(formData.get("colour")) || null,
        countryOfRegistration: asString(formData.get("countryOfRegistration")) || null,
        visibility: allowedVisibility.includes(visibilityValue as (typeof allowedVisibility)[number]) ? visibilityValue as (typeof allowedVisibility)[number] : "PUBLIC",
      },
    });
    return tx.dogIdentity.update({
      where: { id: created.id },
      data: { registryNumber: registryNumber(created.registrySequence), ownerships: { create: { userId: user.id } } },
    });
  });
  redirect(`/dogs/${dog.registryNumber}`);
}

const recordCategories = ["IDENTITY", "DNA", "HEALTH", "CARE", "IDENTIFICATION", "INSURANCE", "PEDIGREE", "TITLES", "WORKING_QUALIFICATIONS", "ACTIVITIES_WORK", "TEMPERAMENT_TESTS", "BREEDING_APPROVALS", "OTHER"] as const;
const behaviourAnswers = neuteredSpayedAnswers;
const recordStatuses = ["HAVE_RECORD", "DO_NOT_HAVE"] as const;

function asEnum<T extends readonly string[]>(value: string, allowed: T, fallback: T[number]): T[number] {
  return allowed.includes(value as T[number]) ? value as T[number] : fallback;
}

function asDate(value: string) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

async function requireDogOwner(dogId: string) {
  const user = await requireUser();
  const ownership = await prisma.dogOwnership.findUnique({ where: { userId_dogId: { userId: user.id, dogId } }, include: { dog: true } });
  if (!ownership) throw new Error("You can only manage records for dogs you own.");
  return ownership.dog;
}

export async function addDogRecord(formData: FormData) {
  const dogId = asString(formData.get("dogId"));
  const dog = await requireDogOwner(dogId);
  const recordType = asString(formData.get("recordType"));
  if (!recordType) throw new Error("Record type is required.");
  await prisma.dogRecord.create({ data: {
    dogId,
    category: asEnum(asString(formData.get("category")), recordCategories, "OTHER"),
    recordType,
    provider: asString(formData.get("provider")) || null,
    status: asEnum(asString(formData.get("status")), recordStatuses, "HAVE_RECORD"),
    verificationStatus: "NOT_SUBMITTED",
    referenceNumber: asString(formData.get("referenceNumber")) || null,
    issueDate: asDate(asString(formData.get("issueDate"))),
    expiryDate: asDate(asString(formData.get("expiryDate"))),
    notes: asString(formData.get("notes")) || null,
  } });
  redirect(`/dogs/${dog.registryNumber}#records`);
}

export async function updateDogRecord(formData: FormData) {
  const recordId = asString(formData.get("recordId"));
  const existing = await prisma.dogRecord.findUnique({ where: { id: recordId } });
  if (!existing) throw new Error("Record not found.");
  const dog = await requireDogOwner(existing.dogId);
  const recordType = asString(formData.get("recordType"));
  await prisma.dogRecord.update({ where: { id: recordId }, data: {
    category: asEnum(asString(formData.get("category")), recordCategories, existing.category),
    recordType: recordType || existing.recordType,
    provider: asString(formData.get("provider")) || null,
    status: asEnum(asString(formData.get("status")), recordStatuses, existing.status),
    referenceNumber: asString(formData.get("referenceNumber")) || null,
    issueDate: asDate(asString(formData.get("issueDate"))),
    expiryDate: asDate(asString(formData.get("expiryDate"))),
    notes: asString(formData.get("notes")) || null,
  } });
  redirect(`/dogs/${dog.registryNumber}#records`);
}

export async function removeDogRecord(formData: FormData) {
  const recordId = asString(formData.get("recordId"));
  const existing = await prisma.dogRecord.findUnique({ where: { id: recordId }, include: { dog: true } });
  if (!existing) throw new Error("Record not found.");
  const dog = await requireDogOwner(existing.dogId);
  await prisma.dogRecord.delete({ where: { id: recordId } });
  redirect(`/dogs/${dog.registryNumber}#records`);
}


export async function updateBehaviourLifestyle(formData: FormData) {
  const dogId = asString(formData.get("dogId"));
  const dog = await requireDogOwner(dogId);
  const answer = (name: string) => asEnum(asString(formData.get(name)), behaviourAnswers, "UNKNOWN");
  const neuteredSpayed = answer("neuteredSpayed");
  await prisma.dogBehaviourLifestyle.upsert({
    where: { dogId },
    create: {
      dogId,
      assessmentSource: "OWNER_DECLARED",
      reactive: answer("reactive"),
      foodAggression: answer("foodAggression"),
      resourceGuarding: answer("resourceGuarding"),
      separationAnxiety: answer("separationAnxiety"),
      highPreyDrive: answer("highPreyDrive"),
      escapeArtist: answer("escapeArtist"),
      goodWithChildren: answer("goodWithChildren"),
      goodWithDogs: answer("goodWithDogs"),
      goodWithCats: answer("goodWithCats"),
      goodWithLivestock: answer("goodWithLivestock"),
      friendlyWithStrangers: answer("friendlyWithStrangers"),
      reliableOffLead: answer("reliableOffLead"),
      recallTrained: answer("recallTrained"),
      crateTrained: answer("crateTrained"),
      muzzleTrained: answer("muzzleTrained"),
      neuteredSpayed,
    },
    update: {
      assessmentSource: "OWNER_DECLARED",
      reactive: answer("reactive"),
      foodAggression: answer("foodAggression"),
      resourceGuarding: answer("resourceGuarding"),
      separationAnxiety: answer("separationAnxiety"),
      highPreyDrive: answer("highPreyDrive"),
      escapeArtist: answer("escapeArtist"),
      goodWithChildren: answer("goodWithChildren"),
      goodWithDogs: answer("goodWithDogs"),
      goodWithCats: answer("goodWithCats"),
      goodWithLivestock: answer("goodWithLivestock"),
      friendlyWithStrangers: answer("friendlyWithStrangers"),
      reliableOffLead: answer("reliableOffLead"),
      recallTrained: answer("recallTrained"),
      crateTrained: answer("crateTrained"),
      muzzleTrained: answer("muzzleTrained"),
      neuteredSpayed,
    },
  });
  await prisma.dogIdentity.update({ where: { id: dogId }, data: { neuteredSpayed } });
  redirect(`/dogs/${dog.registryNumber}#behaviour`);
}
