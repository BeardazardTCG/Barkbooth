"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { deleteObject, putObject } from "@/lib/storage";
import { documentContentTypes, imageContentTypes, MAX_PROFILE_PHOTO_BYTES, MAX_RECORD_DOCUMENT_BYTES, storageKey, validateUpload } from "@/lib/uploads";
import type { ActionResult } from "@/lib/forms/action-result";
import { selectedDogTypes, selectedSex } from "@/lib/dogs/profile-options";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function registryNumber(sequence: number) {
  return `BB-${sequence.toString().padStart(6, "0")}`;
}

const neuteredSpayedAnswers = ["YES", "NO", "UNKNOWN"] as const;

function hasOptionalUpload(value: FormDataEntryValue | null) {
  return value !== null && value !== "" && (!(value instanceof File) || Boolean(value.name) || value.size > 0);
}

async function storeDogProfilePhoto(value: FormDataEntryValue | null, folder: string) {
  const { file, bytes } = await validateUpload(value, imageContentTypes, MAX_PROFILE_PHOTO_BYTES);
  const key = storageKey(folder, file.type);
  await putObject(key, bytes, file.type);
  return {
    storageKey: key,
    fileName: file.name,
    contentType: file.type,
    sizeBytes: file.size,
  };
}

export async function registerDog(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireUser();
  const name = asString(formData.get("name"));
  if (!name) return { status: "error", message: "Dog name is required." };

  const photoValue = formData.get("photo");
  const hasPhoto = hasOptionalUpload(photoValue);

  let dogTypes: string[];
  try {
    dogTypes = selectedDogTypes(formData.getAll("dogTypes"));
  } catch (error) {
    return { status: "error", message: actionErrorMessage(error, "Select at least one dog type.") };
  }
  const primaryRole = dogTypes[0];

  const dateOfBirth = asString(formData.get("dateOfBirth"));
  const allowedVisibility = ["PUBLIC", "PRIVATE", "LINK_ONLY"] as const;
  const visibilityValue = asString(formData.get("visibility"));
  const neuteredSpayedValue = asString(formData.get("neuteredSpayed"));

  let uploadedPhotoKey: string | null = null;
  let dog;
  try {
    const photo = hasPhoto ? await storeDogProfilePhoto(photoValue, "dogs/registrations/profile") : null;
    uploadedPhotoKey = photo?.storageKey ?? null;
    dog = await prisma.$transaction(async (tx) => {
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
          sex: selectedSex(formData.get("sex")),
          colour: asString(formData.get("colour")) || null,
          countryOfRegistration: asString(formData.get("countryOfRegistration")) || null,
          visibility: allowedVisibility.includes(visibilityValue as (typeof allowedVisibility)[number]) ? visibilityValue as (typeof allowedVisibility)[number] : "PUBLIC",
        },
      });
      await tx.ownerStatus.upsert({
        where: { userId_status: { userId: user.id, status: "PET_OWNER" } },
        create: { userId: user.id, status: "PET_OWNER" },
        update: {},
      });
      const registeredDog = await tx.dogIdentity.update({
        where: { id: created.id },
        data: { registryNumber: registryNumber(created.registrySequence), ownerships: { create: { userId: user.id } } },
      });
      if (photo) {
        await tx.dogProfilePhoto.create({ data: { dogId: created.id, uploadedById: user.id, ...photo } });
      }
      return registeredDog;
    });
  } catch (error) {
    if (uploadedPhotoKey) await cleanUpStoredObjects([uploadedPhotoKey], "rollbackDogRegistrationPhotoUpload");
    return { status: "error", message: actionErrorMessage(error, "We could not register this pet. Please try again.") };
  }
  return { status: "success", message: "Pet details saved", redirectTo: `/dogs/${dog.registryNumber}` };
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

async function updatePetDetailsImpl(formData: FormData) {
  const dogId = asString(formData.get("dogId"));
  const dog = await requireDogOwner(dogId);
  const data: Parameters<typeof prisma.dogIdentity.update>[0]["data"] = {};
  if (formData.has("name")) {
    const name = asString(formData.get("name"));
    if (!name) throw new Error("Dog name is required.");
    data.name = name;
  }
  if (formData.has("kennelClubName")) data.kennelClubName = asString(formData.get("kennelClubName")) || null;
  if (formData.has("breedFieldsPresent")) {
    data.breed = asString(formData.get("breed")) || null;
    data.isMixedBreed = formData.get("isMixedBreed") === "on" || asString(formData.get("breed")) === "Mixed Breed";
    data.breedMix = formData.getAll("breedMix").map(asString).filter(Boolean).join(", ") || null;
  }
  if (formData.has("dnaConfirmed")) data.dnaConfirmed = asString(formData.get("dnaConfirmed")) || null;
  if (formData.has("dogTypesPresent")) {
    const dogTypes = selectedDogTypes(formData.getAll("dogTypes"));
    data.dogTypes = dogTypes.join(", ");
    data.primaryRole = dogTypes[0];
  }
  if (formData.has("dateOfBirth")) data.dateOfBirth = asDate(asString(formData.get("dateOfBirth")));
  if (formData.has("estimatedDobPresent")) data.estimatedDob = formData.get("estimatedDob") === "on";
  if (formData.has("sex")) data.sex = selectedSex(formData.get("sex"), dog.sex);
  if (formData.has("colour")) data.colour = asString(formData.get("colour")) || null;
  if (formData.has("countryOfRegistration")) data.countryOfRegistration = asString(formData.get("countryOfRegistration")) || null;
  if (formData.has("visibility")) data.visibility = asEnum(asString(formData.get("visibility")), ["PUBLIC", "PRIVATE", "LINK_ONLY"] as const, dog.visibility);
  await prisma.dogIdentity.update({ where: { id: dogId }, data });
  revalidatePath(`/dogs/${dog.registryNumber}`);
}

async function cleanUpStoredObjects(keys: string[], operation: string) {
  const results = await Promise.allSettled(keys.map((key) => deleteObject(key)));
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error("Object storage cleanup failed after database mutation", {
        operation,
        storageKey: keys[index],
        error: result.reason,
      });
    }
  });
}

function actionErrorMessage(error: unknown, fallback: string) {
  console.error(fallback, error);
  return error instanceof Error && /required|select|supported|smaller|not found|only manage/i.test(error.message) ? error.message : fallback;
}

async function addDogRecordImpl(formData: FormData) {
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
  revalidatePath(`/dogs/${dog.registryNumber}`);
}

async function updateDogRecordImpl(formData: FormData) {
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
  revalidatePath(`/dogs/${dog.registryNumber}`);
}

async function removeDogRecordImpl(formData: FormData) {
  const recordId = asString(formData.get("recordId"));
  const existing = await prisma.dogRecord.findUnique({ where: { id: recordId }, include: { dog: true, documents: true } });
  if (!existing) throw new Error("Record not found.");
  const dog = await requireDogOwner(existing.dogId);
  await prisma.dogRecord.delete({ where: { id: recordId } });
  await cleanUpStoredObjects(existing.documents.map((document) => document.storageKey), "removeDogRecord");
  revalidatePath(`/dogs/${dog.registryNumber}`);
}

async function uploadDogProfilePhotoImpl(formData: FormData) {
  const user = await requireUser();
  const dogId = asString(formData.get("dogId"));
  const dog = await requireDogOwner(dogId);
  const photo = await storeDogProfilePhoto(formData.get("photo"), `dogs/${dogId}/profile`);
  let previous: { storageKey: string } | null = null;
  try {
    previous = await prisma.$transaction(async (tx) => {
      const old = await tx.dogProfilePhoto.findUnique({ where: { dogId }, select: { storageKey: true } });
      await tx.dogProfilePhoto.upsert({
        where: { dogId },
        create: { dogId, uploadedById: user.id, ...photo },
        update: { uploadedById: user.id, ...photo },
      });
      return old;
    });
  } catch (error) {
    await cleanUpStoredObjects([photo.storageKey], "rollbackDogProfilePhotoUpload");
    throw error;
  }
  if (previous) await cleanUpStoredObjects([previous.storageKey], "replaceDogProfilePhoto");
  revalidatePath(`/dogs/${dog.registryNumber}`);
}

async function removeDogProfilePhotoImpl(formData: FormData) {
  const dogId = asString(formData.get("dogId"));
  const dog = await requireDogOwner(dogId);
  const photo = await prisma.dogProfilePhoto.findUnique({ where: { dogId } });
  if (photo) {
    await prisma.dogProfilePhoto.delete({ where: { id: photo.id } });
    await cleanUpStoredObjects([photo.storageKey], "removeDogProfilePhoto");
  }
  revalidatePath(`/dogs/${dog.registryNumber}`);
}

async function uploadRecordDocumentImpl(formData: FormData) {
  const user = await requireUser();
  const recordId = asString(formData.get("recordId"));
  const record = await prisma.dogRecord.findUnique({ where: { id: recordId }, include: { dog: true } });
  if (!record) throw new Error("Record not found.");
  await requireDogOwner(record.dogId);
  const { file, bytes } = await validateUpload(formData.get("document"), documentContentTypes, MAX_RECORD_DOCUMENT_BYTES);
  const key = storageKey(`dogs/${record.dogId}/records/${record.id}`, file.type);
  await putObject(key, bytes, file.type);
  try {
    await prisma.dogRecordDocument.create({ data: { recordId, uploadedById: user.id, storageKey: key, fileName: file.name, contentType: file.type, sizeBytes: file.size } });
  } catch (error) {
    await cleanUpStoredObjects([key], "rollbackRecordDocumentUpload");
    throw error;
  }
  revalidatePath(`/dogs/${record.dog.registryNumber}`);
}

async function removeRecordDocumentImpl(formData: FormData) {
  const documentId = asString(formData.get("documentId"));
  const document = await prisma.dogRecordDocument.findUnique({ where: { id: documentId }, include: { record: { include: { dog: true } } } });
  if (!document) throw new Error("Document not found.");
  await requireDogOwner(document.record.dogId);
  await prisma.dogRecordDocument.delete({ where: { id: document.id } });
  await cleanUpStoredObjects([document.storageKey], "removeRecordDocument");
  revalidatePath(`/dogs/${document.record.dog.registryNumber}`);
}


async function updateBehaviourLifestyleImpl(formData: FormData) {
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
  revalidatePath(`/dogs/${dog.registryNumber}`);
}

async function runPetAction(operation: () => Promise<void>, success: string, reset = false): Promise<ActionResult> {
  try {
    await operation();
    return { status: "success", message: success, reset };
  } catch (error) {
    return { status: "error", message: actionErrorMessage(error, "Something went wrong. Your changes were not saved. Please try again.") };
  }
}

export async function addDogRecord(_previous: ActionResult, formData: FormData) { return runPetAction(() => addDogRecordImpl(formData), "Record added", true); }
export async function updateDogRecord(_previous: ActionResult, formData: FormData) { return runPetAction(() => updateDogRecordImpl(formData), "Record saved"); }
export async function removeDogRecord(_previous: ActionResult, formData: FormData) { return runPetAction(() => removeDogRecordImpl(formData), "Record removed"); }
export async function uploadDogProfilePhoto(_previous: ActionResult, formData: FormData) { return runPetAction(() => uploadDogProfilePhotoImpl(formData), formData.get("replacing") === "true" ? "Photo replaced" : "Photo uploaded", true); }
export async function removeDogProfilePhoto(_previous: ActionResult, formData: FormData) { return runPetAction(() => removeDogProfilePhotoImpl(formData), "Photo removed"); }
export async function uploadRecordDocument(_previous: ActionResult, formData: FormData) { return runPetAction(() => uploadRecordDocumentImpl(formData), "Document uploaded", true); }
export async function removeRecordDocument(_previous: ActionResult, formData: FormData) { return runPetAction(() => removeRecordDocumentImpl(formData), "Document removed"); }
export async function updateBehaviourLifestyle(_previous: ActionResult, formData: FormData) { return runPetAction(() => updateBehaviourLifestyleImpl(formData), "Behaviour and lifestyle saved"); }
export async function updatePetDetails(_previous: ActionResult, formData: FormData) { return runPetAction(() => updatePetDetailsImpl(formData), "Pet details saved"); }
