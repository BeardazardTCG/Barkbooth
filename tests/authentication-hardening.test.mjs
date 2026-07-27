import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const actions = await readFile(new URL("../lib/auth/actions.ts", import.meta.url), "utf8");
const sessions = await readFile(new URL("../lib/auth/session.ts", import.meta.url), "utf8");
const schema = await readFile(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
const loginForm = await readFile(new URL("../app/login/login-form.tsx", import.meta.url), "utf8");
const passwordField = await readFile(new URL("../components/forms/password-field.tsx", import.meta.url), "utf8");
const resetSource = await readFile(new URL("../lib/auth/password-reset.ts", import.meta.url), "utf8");

const compiledReset = ts.transpileModule(resetSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const resetModule = { exports: {} };
new Function("require", "module", "exports", compiledReset)(await import("node:module").then(({ createRequire }) => createRequire(import.meta.url)), resetModule, resetModule.exports);

test("signup distinguishes success, duplicate email, and duplicate username paths", () => {
  assert.match(actions, /prisma\.user\.create/);
  assert.match(actions, /conflict === "email" \? "email_exists"/);
  assert.match(actions, /conflict === "username" \? "username_exists"/);
  assert.match(actions, /status: "success", message: "Account created"/);
});

test("login distinguishes success, wrong password, unknown account, and lockout", () => {
  assert.match(actions, /"user_not_found"/);
  assert.match(actions, /"password_mismatch"/);
  assert.match(actions, /"account_locked"/);
  assert.match(actions, /await createSession\(user\.id, remember\)/);
});

test("reset tokens are random, hashed at rest, expiring, and single use", () => {
  const first = resetModule.exports.createPasswordResetToken();
  const second = resetModule.exports.createPasswordResetToken();
  assert.notEqual(first.token, second.token);
  assert.equal(first.tokenHash, resetModule.exports.hashPasswordResetToken(first.token));
  assert.doesNotMatch(first.tokenHash, new RegExp(first.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.ok(first.expiresAt > new Date());
  assert.match(schema, /tokenHash String\s+@unique/);
  assert.match(schema, /expiresAt DateTime/);
  assert.match(schema, /usedAt\s+DateTime\?/);
  assert.match(actions, /updateMany\(\{ where: \{ id: reset\.id, usedAt: null, expiresAt: \{ gt: new Date\(\) \} \}/);
  assert.match(actions, /"expired_token"/);
  assert.match(actions, /"reused_token"/);
});

test("password reset changes the hash, unlocks the account, and invalidates sessions", () => {
  assert.match(actions, /passwordHash: hashPassword\(password\), failedLoginAttempts: 0, lockedUntil: null/);
  assert.match(actions, /tx\.session\.deleteMany\(\{ where: \{ userId \} \}\)/);
  assert.match(actions, /tx\.passwordResetToken\.updateMany\(\{ where: \{ userId, usedAt: null \}/);
});

test("logout deletes the server session and browser cookie", () => {
  assert.match(actions, /await deleteCurrentSession\(\)/);
  assert.match(sessions, /prisma\.session\.deleteMany/);
  assert.match(sessions, /cookies\(\)\.delete\(SESSION_COOKIE\)/);
});

test("sessions persist with compatible secure browser cookie settings", () => {
  assert.match(sessions, /httpOnly: true/);
  assert.match(sessions, /sameSite: "lax"/);
  assert.match(sessions, /secure: process\.env\.NODE_ENV === "production"/);
  assert.match(sessions, /path: "\/"/);
  assert.match(sessions, /remember \? \{ expires: expiresAt \} : \{\}/);
});

test("desktop and mobile-compatible login controls preserve values and autofill semantics", () => {
  assert.match(loginForm, /autoComplete="email"/);
  assert.match(loginForm, /autoCapitalize="none"/);
  assert.match(loginForm, /name="remember"/);
  assert.match(passwordField, /autoComplete=\{autoComplete\}/);
  assert.match(passwordField, /visible \? "text" : "password"/);
  assert.match(passwordField, /aria-pressed=\{visible\}/);
});

test("diagnostics prohibit credential and identity fields", async () => {
  const diagnostics = await readFile(new URL("../lib/auth/diagnostics.ts", import.meta.url), "utf8");
  for (const forbidden of ["password", "email", "username", "token"]) assert.doesNotMatch(diagnostics, new RegExp(`${forbidden}:`, "i"));
  for (const required of ["requestId", "timestamp", "buildId", "browser", "platform"]) assert.match(diagnostics, new RegExp(required));
});
