"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { createSession, deleteCurrentSession, SessionError } from "@/lib/auth/session";
import { hashPassword, passwordHashStatus } from "@/lib/auth/password";
import { createPasswordResetToken, hashPasswordResetToken } from "@/lib/auth/password-reset";
import { sendPasswordResetEmail } from "@/lib/auth/email";
import { logAuthDiagnostic } from "@/lib/auth/diagnostics";
import { prisma } from "@/lib/prisma";
import { isSupportedLocation } from "@/lib/locations";
import type { ActionResult } from "@/lib/forms/action-result";

const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function asPassword(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function passwordPolicyError(password: string) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 128) return "Password must be 128 characters or fewer.";
  return null;
}

function sessionFailure(operation: "login" | "signup" | "password_reset", error: unknown) {
  const reason = error instanceof SessionError && error.stage === "cookie" ? "cookie_write_failed" : "session_creation_failed";
  logAuthDiagnostic(operation, reason, error);
}

function uniqueConflict(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") return null;
  const target = Array.isArray(error.meta?.target) ? error.meta.target.join(" ") : String(error.meta?.target ?? "");
  return target.includes("email") ? "email" : target.includes("username") ? "username" : "unknown";
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

  if (!email || !password || !displayName || !username || !country) {
    logAuthDiagnostic("signup", "validation_failed");
    return { status: "error", message: "Please complete all required fields." };
  }
  if (!isSupportedLocation(country) || !over16 || !/^\S+@\S+\.\S+$/.test(email) || !/^[a-z0-9_]{3,30}$/.test(username)) {
    logAuthDiagnostic("signup", "validation_failed");
    return { status: "error", message: !isSupportedLocation(country) ? "Choose a supported location." : !over16 ? "You must confirm you are over 16 to create an account." : "Check your email and use a username with 3–30 letters, numbers, or underscores." };
  }
  const policyError = passwordPolicyError(password);
  if (policyError) {
    logAuthDiagnostic("signup", "password_policy_failed");
    return { status: "error", message: policyError };
  }
  if (password !== passwordConfirm) {
    logAuthDiagnostic("signup", "validation_failed");
    return { status: "error", message: "Passwords do not match." };
  }

  let user;
  try {
    user = await prisma.user.create({ data: { email, passwordHash: hashPassword(password), displayName, username, country, over16, ownerStatuses: wantsPetOwner ? { create: [{ status: "PET_OWNER" }] } : undefined } });
  } catch (error) {
    const conflict = uniqueConflict(error);
    logAuthDiagnostic("signup", conflict === "email" ? "email_exists" : conflict === "username" ? "username_exists" : "database_error", error);
    if (conflict === "email") return { status: "error", message: "An account already uses that email. Try logging in or reset your password." };
    if (conflict === "username") return { status: "error", message: "That username is already in use. Choose another." };
    return { status: "error", message: "We could not create your account. Please try again." };
  }
  try {
    await createSession(user.id);
  } catch (error) {
    sessionFailure("signup", error);
    return { status: "error", message: "Your account was created, but we could not sign you in. Please use the login page." };
  }
  return { status: "success", message: "Account created", redirectTo: "/register-dog" };
}

export async function login(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = asString(formData.get("email")).toLowerCase();
  const password = asPassword(formData.get("password"));
  const remember = formData.get("remember") === "on";
  if (!email || !password) return { status: "error", message: "Enter your email and password." };
  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    logAuthDiagnostic("login", "database_error", error);
    return { status: "error", message: "We could not log you in right now. Please try again." };
  }
  if (!user) {
    logAuthDiagnostic("login", "user_not_found");
    return { status: "error", message: "Invalid email or password." };
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    logAuthDiagnostic("login", "account_locked");
    return { status: "error", message: "Too many unsuccessful attempts. Reset your password or try again later." };
  }
  const status = passwordHashStatus(password, user.passwordHash);
  if (status !== "match") {
    const failedLoginAttempts = user.failedLoginAttempts + 1;
    try {
      await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts, lockedUntil: failedLoginAttempts >= MAX_FAILED_LOGINS ? new Date(Date.now() + LOCKOUT_MS) : null } });
    } catch (error) {
      logAuthDiagnostic("login", "database_error", error);
      return { status: "error", message: "We could not log you in right now. Please try again." };
    }
    logAuthDiagnostic("login", status === "invalid" ? "password_reset_required" : "password_mismatch");
    return { status: "error", message: status === "invalid" ? "This account needs a password reset before it can log in." : "Invalid email or password." };
  }
  try {
    await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockedUntil: null } });
    await createSession(user.id, remember);
  } catch (error) {
    if (error instanceof SessionError) sessionFailure("login", error);
    else logAuthDiagnostic("login", "database_error", error);
    return { status: "error", message: "We could not start your session. Please try again." };
  }
  return { status: "success", message: "Welcome back", redirectTo: "/dogs" };
}

export async function requestPasswordReset(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = asString(formData.get("email")).toLowerCase();
  const generic = { status: "success", message: "If an account exists for that email, a reset link has been sent.", reset: true } as const;
  if (!email) return generic;
  let user;
  try {
    user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
  } catch (error) {
    logAuthDiagnostic("password_reset_request", "database_error", error);
    return generic;
  }
  if (!user) return generic;
  const reset = createPasswordResetToken();
  try {
    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } }),
      prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: reset.tokenHash, expiresAt: reset.expiresAt } }),
    ]);
    const baseUrl = process.env.APP_URL;
    if (!baseUrl) throw new Error("APP_URL is not configured.");
    await sendPasswordResetEmail(user.email, `${baseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(reset.token)}`);
  } catch (error) {
    await prisma.passwordResetToken.deleteMany({ where: { tokenHash: reset.tokenHash } }).catch(() => undefined);
    logAuthDiagnostic("password_reset_request", "delivery_failed", error);
  }
  return generic;
}

export async function resetPassword(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const token = asString(formData.get("token"));
  const password = asPassword(formData.get("password"));
  const confirmation = asPassword(formData.get("passwordConfirm"));
  const policyError = passwordPolicyError(password);
  if (!token || policyError || password !== confirmation) {
    logAuthDiagnostic("password_reset", policyError ? "password_policy_failed" : "validation_failed");
    return { status: "error", message: policyError ?? (password !== confirmation ? "Passwords do not match." : "This reset link is invalid or has expired.") };
  }
  const tokenHash = hashPasswordResetToken(token);
  let userId: string;
  try {
    const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!reset || reset.usedAt || reset.expiresAt <= new Date()) {
      logAuthDiagnostic("password_reset", !reset ? "invalid_token" : reset.usedAt ? "reused_token" : "expired_token");
      return { status: "error", message: "This reset link is invalid or has expired. Request a new one." };
    }
    userId = reset.userId;
    const used = await prisma.$transaction(async (tx) => {
      const claimed = await tx.passwordResetToken.updateMany({ where: { id: reset.id, usedAt: null, expiresAt: { gt: new Date() } }, data: { usedAt: new Date() } });
      if (claimed.count !== 1) return false;
      await tx.user.update({ where: { id: userId }, data: { passwordHash: hashPassword(password), failedLoginAttempts: 0, lockedUntil: null } });
      await tx.session.deleteMany({ where: { userId } });
      await tx.passwordResetToken.updateMany({ where: { userId, usedAt: null }, data: { usedAt: new Date() } });
      return true;
    });
    if (!used) return { status: "error", message: "This reset link is invalid or has expired. Request a new one." };
  } catch (error) {
    logAuthDiagnostic("password_reset", "database_error", error);
    return { status: "error", message: "We could not reset your password. Please try again." };
  }
  try {
    await createSession(userId);
  } catch (error) {
    sessionFailure("password_reset", error);
    return { status: "success", message: "Password reset. Please log in.", redirectTo: "/login" };
  }
  return { status: "success", message: "Password reset", redirectTo: "/dogs" };
}

export async function logout() {
  try {
    await deleteCurrentSession();
  } catch (error) {
    logAuthDiagnostic("logout", "database_error", error);
  }
  redirect("/login");
}
