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
  const exact = "  intentional spaces  ";
  const hash = passwords.hashPassword(exact);
  assert.equal(passwords.passwordHashStatus(exact, hash), "match");
  assert.equal(passwords.passwordHashStatus(exact.trim(), hash), "mismatch");
  assert.equal(passwords.passwordHashStatus("anything", "legacy-or-malformed"), "invalid");
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
