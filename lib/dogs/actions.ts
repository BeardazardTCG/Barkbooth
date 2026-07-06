"use server";

import { DogVisibility } from "@prisma/client";
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
  const primaryRole = asString(formData.get("primaryRole"));
  if (!name || !primaryRole) return "Dog name and primary role are required.";

  const dateOfBirth = asString(formData.get("dateOfBirth"));
  const visibilityValue = asString(formData.get("visibility")) as DogVisibility;

  const dog = await prisma.$transaction(async (tx) => {
    const created = await tx.dogIdentity.create({
      data: {
        registryNumber: "PENDING",
        name,
        primaryRole,
        breed: asString(formData.get("breed")) || null,
        dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00.000Z`) : null,
        estimatedDob: formData.get("estimatedDob") === "on",
        sex: asString(formData.get("sex")) || null,
        colour: asString(formData.get("colour")) || null,
        countryOfRegistration: asString(formData.get("countryOfRegistration")) || null,
        visibility: Object.values(DogVisibility).includes(visibilityValue) ? visibilityValue : DogVisibility.PUBLIC,
      },
    });
    return tx.dogIdentity.update({
      where: { id: created.id },
      data: { registryNumber: registryNumber(created.registrySequence), ownerships: { create: { userId: user.id } } },
    });
  });
  redirect(`/dogs/${dog.registryNumber}`);
}
