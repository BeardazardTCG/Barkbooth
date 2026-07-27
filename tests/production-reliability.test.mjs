import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
const nodeRequire = createRequire(import.meta.url);

async function loadTypescriptModule(relativePath, mocks = {}) {
  const filename = new URL(relativePath, import.meta.url);
  const source = await readFile(filename, "utf8");
  const output = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  const context = vm.createContext({ module, exports: module.exports, console, process, Buffer, setTimeout, clearTimeout, URL, FormData, File: globalThis.File });
  // JSX runtime is supplied explicitly because ESM tests have no CommonJS require.
  context.require = (id) => {
    if (id in mocks) return mocks[id];
    return nodeRequire(id);
  };
  vm.runInContext(output, context, { filename: filename.pathname });
  return module.exports;
}

test("DogCard renders constrained photography, resilient metadata, badges, and an explicit management action", async () => {
  const { DogCard } = await loadTypescriptModule("../components/dog-card.tsx", {
    "next/link": { __esModule: true, default: ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children) },
    "./ui": { PawAvatar: ({ label, ...props }) => React.createElement("div", { ...props }, label) },
  });
  const html = renderToStaticMarkup(React.createElement(DogCard, { dog: { id: "dog-1", name: "A very long dog name that still remains visible", registryNumber: "BB-VERY-LONG-REGISTRY-DATA", breed: null, primaryRole: "Companion", profilePhoto: { updatedAt: new Date("2026-01-01T00:00:00Z") } }, relationship: "Foster", dualOwnership: true }));
  assert.match(html, /overflow-hidden[^\"]*aspect-\[16\/9\]/);
  assert.match(html, /class="h-full w-full object-cover"/);
  assert.match(html, /BB-VERY-LONG-REGISTRY-DATA/);
  assert.match(html, /A very long dog name/);
  assert.match(html, /Breed not recorded · Companion/);
  assert.match(html, /Foster/);
  assert.match(html, /Dual ownership/);
  assert.match(html, />Manage dog\s*</);
  assert.match(html, /href="\/dogs\/BB-VERY-LONG-REGISTRY-DATA"/);
});

test("compact DogCard keeps its image in a fixed square and its body in normal flow", async () => {
  const source = await readFile(new URL("../components/dog-card.tsx", import.meta.url), "utf8");
  assert.match(source, /grid-cols-\[7rem_minmax\(0,1fr\)\]/);
  assert.match(source, /aspect-square h-28 w-28/);
  assert.doesNotMatch(source, /<img[^>]*aspect-/);
});

test("route shell classification separates every specified public and owner route", async () => {
  const routes = await loadTypescriptModule("../lib/app-routes.ts");
  for (const path of ["/dashboard", "/dogs", "/dogs/BB-1", "/register-dog", "/account"]) assert.equal(routes.isOwnerWorkspaceRoute(path), true, path);
  for (const path of ["/", "/profiles", "/competitions", "/directory", "/about"]) {
    assert.equal(routes.isPublicRoute(path), true, path);
    assert.equal(routes.isOwnerWorkspaceRoute(path), false, path);
  }
});

test("stale and network action failures execute a mutation once and remain recoverable", async () => {
  const recovery = await loadTypescriptModule("../lib/forms/transport-recovery.ts");
  let staleCalls = 0;
  const stale = await recovery.runActionOnce(async () => { staleCalls += 1; throw new Error("Failed to find Server Action. This request might be from an older or newer deployment."); });
  assert.equal(staleCalls, 1, "an upload or destructive mutation is never automatically resubmitted");
  assert.equal(stale.reload, true);
  assert.equal(stale.error, "Bark Booth has been updated. Refreshing the page so you can continue.");
  let networkCalls = 0;
  const network = await recovery.runActionOnce(async () => { networkCalls += 1; throw new Error("network disconnected"); });
  assert.equal(networkCalls, 1);
  assert.equal(network.reload, false, "ordinary transport failures leave the form usable for an explicit retry");
  assert.match(network.error, /not submitted.*try again/i);
});

test("password verification preserves exact characters and rejects malformed historical hashes safely", async () => {
  const passwords = await loadTypescriptModule("../lib/auth/password.ts");
  const ordinaryHash = passwords.hashPassword("password123");
  assert.equal(passwords.passwordHashStatus("password123", ordinaryHash), "match");
  assert.equal(passwords.passwordHashStatus(" password123", ordinaryHash), "mismatch");
  assert.equal(passwords.passwordHashStatus("password123 ", ordinaryHash), "mismatch");
  const exact = "  intentional spaces  ";
  const hash = passwords.hashPassword(exact);
  assert.equal(passwords.passwordHashStatus(exact, hash), "match");
  assert.equal(passwords.passwordHashStatus(exact.trim(), hash), "mismatch");
  assert.equal(passwords.passwordHashStatus("anything", "legacy-or-malformed"), "invalid");
});

test("login accepts only the exact password and never updates a hash after mismatches", async () => {
  const passwords = await loadTypescriptModule("../lib/auth/password.ts");
  let storedHash = passwords.hashPassword("password123");
  const updates = [];
  const sessions = [];
  const actions = await loadTypescriptModule("../lib/auth/actions.ts", {
    "next/navigation": { redirect() {} },
    "@/lib/auth/session": { createSession: async (id) => sessions.push(id), deleteCurrentSession: async () => {} },
    "@/lib/auth/password": passwords,
    "@/lib/prisma": { prisma: { user: {
      findUnique: async ({ where }) => ({ id: "user-1", email: where.email, passwordHash: storedHash }),
      update: async (args) => updates.push(args),
    } } },
    "@/lib/locations": { isSupportedLocation: () => true },
  });

  const attempt = (password) => {
    const data = new FormData();
    data.set("email", "  OWNER@EXAMPLE.COM  ");
    data.set("password", password);
    return actions.login({ status: "idle" }, data);
  };

  for (const candidate of [" password123", "password123 "]) {
    const result = await attempt(candidate);
    assert.deepEqual({ ...result }, { status: "error", message: "Invalid email or password." });
  }
  assert.equal(updates.length, 0, "failed login never rewrites a password hash");
  assert.equal(sessions.length, 0, "whitespace alternatives never create a session");

  const exact = await attempt("password123");
  assert.deepEqual({ ...exact }, { status: "success", message: "Welcome back", redirectTo: "/dogs" });
  assert.deepEqual(sessions, ["user-1"]);
  assert.equal(updates.length, 0, "valid login also does not rewrite the password hash");

  storedHash = passwords.hashPassword(" intentional spaces ");
  sessions.length = 0;
  const missingSpaces = await attempt("intentional spaces");
  assert.deepEqual({ ...missingSpaces }, { status: "error", message: "Invalid email or password." });
  const exactSpaces = await attempt(" intentional spaces ");
  assert.deepEqual({ ...exactSpaces }, { status: "success", message: "Welcome back", redirectTo: "/dogs" });
  assert.deepEqual(sessions, ["user-1"], "an intentionally spaced password authenticates only exactly");
  assert.equal(updates.length, 0);

  storedHash = "malformed-historical-hash";
  sessions.length = 0;
  const malformed = await attempt("password123");
  assert.deepEqual({ ...malformed }, { status: "error", message: "Invalid email or password." });
  assert.equal(sessions.length, 0);
  assert.equal(updates.length, 0);
});

test("authentication normalizes email but preserves submitted password characters", async () => {
  const actions = await readFile(new URL("../lib/auth/actions.ts", import.meta.url), "utf8");
  assert.match(actions, /asString\(formData\.get\("email"\)\)\.toLowerCase\(\)/);
  assert.match(actions, /asPassword\(formData\.get\("password"\)\)/);
  assert.match(actions, /typeof value === "string" \? value : ""/);
  assert.doesNotMatch(actions, /const password = asString/);
});

test("registration commits identity, ownership and optional photo then refreshes every affected journey", async () => {
  const actions = await readFile(new URL("../lib/dogs/actions.ts", import.meta.url), "utf8");
  const registration = actions.slice(actions.indexOf("export async function registerDog"), actions.indexOf("const recordCategories"));
  assert.match(registration, /prisma\.\$transaction/);
  assert.match(registration, /ownerships: \{ create: \{ userId: user\.id \} \}/);
  assert.match(registration, /if \(photo\)[\s\S]*dogProfilePhoto\.create/);
  assert.match(registration, /revalidateDogSurfaces\(dog\.registryNumber\)/);
  assert.match(registration, /redirectTo: `\/dogs\/\$\{dog\.registryNumber\}`/);
  for (const path of ["/dashboard", "/dogs", "/profiles"]) assert.match(actions, new RegExp(`revalidatePath\\("${path}"\\)`));
});

test("owner navigation labels Dashboard and provides deliberate public-home destinations", async () => {
  const nav = await readFile(new URL("../components/nav.tsx", import.meta.url), "utf8");
  assert.match(nav, /\["Dashboard", "\/dashboard", "home"\]/);
  assert.doesNotMatch(nav, /\["Home", "\/dashboard"/);
  assert.match(nav, /\["Public homepage", "\/", "globe"\]/);
  assert.match(nav, /href="\/"[^>]*aria-label="Visit Bark Booth public homepage"/);
});
