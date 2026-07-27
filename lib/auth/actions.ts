"use server";

import { redirect } from "next/navigation";
import { createSession, deleteCurrentSession } from "@/lib/auth/session";
import { hashPassword, passwordHashStatus } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { isSupportedLocation } from "@/lib/locations";
import type { ActionResult } from "@/lib/forms/action-result";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function asPassword(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function logAuthDiagnostic(operation: "login" | "signup", reason: string) {
  console.error("Authentication operation failed", {
    operation,
    reason,
    buildId: process.env.RENDER_GIT_COMMIT ?? process.env.NEXT_PUBLIC_RENDER_GIT_COMMIT ?? "unknown",
  });
}

export async function signup(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = asString(formData.get("email")).toLowerCase();
  const password = asPassword(formData.get("password"));
  const passwordConfirm = asPassword(formData.get("passwordConfirm"));
  const displayName = asString(formData.get("displayName"));
  const username = asString(formData.get("username")).toLowerCase().replace(/^@/, "");
  const country = asString(formData.get("country"));
  const over16 = formData.get("over16") === "on";
  const wantsPetOwner = formData.get("ownerStatuses") === "PET_OWNER";

  if (!email || !password || !displayName || !username || !country) return { status: "error", message: "Please complete all required fields." };
  if (!isSupportedLocation(country)) return { status: "error", message: "Choose a supported location." };
  if (password.length < 8) return { status: "error", message: "Password must be at least 8 characters." };
  if (password !== passwordConfirm) return { status: "error", message: "Passwords do not match." };
  if (!over16) return { status: "error", message: "You must confirm you are over 16 to create an account." };

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
    try {
      await createSession(user.id);
    } catch {
      logAuthDiagnostic("signup", "session_creation_failed");
      return { status: "error", message: "Your account was created, but we could not sign you in. Please use the login page." };
    }
  } catch {
    logAuthDiagnostic("signup", "account_creation_failed");
    return { status: "error", message: "That email or username is already registered." };
  }
  return { status: "success", message: "Account created", redirectTo: "/register-dog" };
}

export async function login(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = asString(formData.get("email")).toLowerCase();
  const password = asPassword(formData.get("password"));
  if (!email || !password) return { status: "error", message: "Enter your email and password." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    logAuthDiagnostic("login", "user_not_found");
    return { status: "error", message: "Invalid email or password." };
  }
  const status = passwordHashStatus(password, user.passwordHash);
  if (status === "invalid") {
    logAuthDiagnostic("login", "invalid_or_legacy_hash");
    return { status: "error", message: "Invalid email or password." };
  }
  if (status === "mismatch") {
    // Accounts created before exact-password handling hashed a silently trimmed value.
    // Accept that legacy value once and migrate it to the exact submitted password.
    const legacyPassword = password.trim();
    if (legacyPassword === password || passwordHashStatus(legacyPassword, user.passwordHash) !== "match") {
      logAuthDiagnostic("login", "password_mismatch");
      return { status: "error", message: "Invalid email or password." };
    }
    try {
      await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(password) } });
    } catch {
      logAuthDiagnostic("login", "legacy_password_migration_failed");
      return { status: "error", message: "We could not sign you in. Please try again." };
    }
    logAuthDiagnostic("login", "legacy_trimmed_password_migrated");
  }
  try {
    await createSession(user.id);
  } catch {
    logAuthDiagnostic("login", "session_creation_failed");
    return { status: "error", message: "We could not start your session. Please try again." };
  }
  return { status: "success", message: "Welcome back", redirectTo: "/dogs" };
}

export async function logout() {
  await deleteCurrentSession();
  redirect("/login");
}
