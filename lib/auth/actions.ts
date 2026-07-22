"use server";

import { redirect } from "next/navigation";
import { createSession, deleteCurrentSession } from "@/lib/auth/session";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { isSupportedLocation } from "@/lib/locations";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function signup(_prevState: string | null, formData: FormData) {
  const email = asString(formData.get("email")).toLowerCase();
  const password = asString(formData.get("password"));
  const passwordConfirm = asString(formData.get("passwordConfirm"));
  const displayName = asString(formData.get("displayName"));
  const username = asString(formData.get("username")).toLowerCase().replace(/^@/, "");
  const country = asString(formData.get("country"));
  const over16 = formData.get("over16") === "on";
  const wantsPetOwner = formData.get("ownerStatuses") === "PET_OWNER";

  if (!email || !password || !displayName || !username || !country) return "Please complete all required fields.";
  if (!isSupportedLocation(country)) return "Choose a supported location.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password !== passwordConfirm) return "Passwords do not match.";
  if (!over16) return "You must confirm you are over 16 to create an account.";

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        displayName,
        username,
        country,
        over16,
        ownerStatuses: wantsPetOwner ? { create: [{ status: "PET_OWNER" }] } : undefined,
      },
    });
    await createSession(user.id);
  } catch {
    return "That email or username is already registered.";
  }
  redirect("/register-dog");
}

export async function login(_prevState: string | null, formData: FormData) {
  const email = asString(formData.get("email")).toLowerCase();
  const password = asString(formData.get("password"));
  if (!email || !password) return "Enter your email and password.";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) return "Invalid email or password.";
  await createSession(user.id);
  redirect("/dogs");
}

export async function logout() {
  await deleteCurrentSession();
  redirect("/login");
}
