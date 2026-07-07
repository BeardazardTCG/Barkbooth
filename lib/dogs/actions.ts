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

export async function registerDog(_prevState: string | null, formData: FormData) {
  const user = await requireUser();
  const name = asString(formData.get("name"));
  if (!name) return "Dog name is required.";

  const dogTypes = Array.from(new Set(formData.getAll("dogTypes").map((value) => asString(value)).filter(Boolean)));
  const primaryRole = dogTypes[0] ?? "Pet";

  const dateOfBirth = asString(formData.get("dateOfBirth"));
  const allowedVisibility = ["PUBLIC", "PRIVATE", "LINK_ONLY"] as const;
  const visibilityValue = asString(formData.get("visibility"));

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
