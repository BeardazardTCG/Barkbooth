import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logAuthDiagnostic } from "@/lib/auth/diagnostics";

const SESSION_COOKIE = "bb_session";
const SESSION_DAYS = 30;
const SESSION_HOURS = 12;

export class SessionError extends Error {
  constructor(public readonly stage: "database" | "cookie", options?: ErrorOptions) {
    super(`Session ${stage} operation failed.`, options);
  }
}

export async function createSession(userId: string, remember = false) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + (remember ? SESSION_DAYS * 24 : SESSION_HOURS) * 60 * 60 * 1000);
  try {
    await prisma.session.create({ data: { token, userId, expiresAt } });
  } catch (error) {
    throw new SessionError("database", { cause: error });
  }
  try {
    cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", ...(remember ? { expires: expiresAt } : {}) });
  } catch (error) {
    await prisma.session.deleteMany({ where: { token } }).catch(() => undefined);
    throw new SessionError("cookie", { cause: error });
  }
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  let session;
  try {
    session = await prisma.session.findUnique({ where: { token }, include: { user: { include: { ownerStatuses: true, roleApplications: true } } } });
  } catch (error) {
    logAuthDiagnostic("session_validation", "database_error", error);
    return null;
  }
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { token } });
    cookies().delete(SESSION_COOKIE);
    return null;
  }
  return session.user;
}

export async function deleteCurrentSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  try {
    if (token) await prisma.session.deleteMany({ where: { token } });
  } finally {
    cookies().delete(SESSION_COOKIE);
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
