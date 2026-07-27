import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const ITERATIONS = 210_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  return passwordHashStatus(password, storedHash) === "match";
}

export type PasswordHashStatus = "match" | "mismatch" | "invalid";

export function passwordHashStatus(password: string, storedHash: string | null | undefined): PasswordHashStatus {
  if (typeof storedHash !== "string") return "invalid";
  const [iterations, salt, hash] = storedHash.split(":");
  const iterationCount = Number(iterations);
  if (!iterations || !salt || !hash || !Number.isSafeInteger(iterationCount) || iterationCount < 1 || iterationCount > 1_000_000 || !/^[a-f\d]+$/i.test(salt) || !/^[a-f\d]+$/i.test(hash) || hash.length !== KEY_LENGTH * 2) return "invalid";
  const candidate = pbkdf2Sync(password, salt, iterationCount, KEY_LENGTH, DIGEST);
  const original = Buffer.from(hash, "hex");
  return original.length === candidate.length && timingSafeEqual(original, candidate) ? "match" : "mismatch";
}
