"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { isSupportedLocation } from "@/lib/locations";
import { prisma } from "@/lib/prisma";

export async function updateAccountLocation(formData: FormData) {
  const user = await requireUser();
  const location = typeof formData.get("country") === "string" ? String(formData.get("country")).trim() : "";
  if (!isSupportedLocation(location)) redirect("/account?location=invalid");
  await prisma.user.update({ where: { id: user.id }, data: { country: location } });
  redirect("/account?location=updated");
}
