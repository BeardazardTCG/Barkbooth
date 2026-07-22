import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const managed = await readFile(new URL("../components/forms/managed-form.tsx", import.meta.url), "utf8");
const register = await readFile(new URL("../app/register-dog/register-dog-form.tsx", import.meta.url), "utf8");
const profile = await readFile(new URL("../app/dogs/[registryNumber]/page.tsx", import.meta.url), "utf8");
const records = await readFile(new URL("../components/records/record-components.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../lib/dogs/actions.ts", import.meta.url), "utf8");

test("shared form system exposes dirty, pending, success, and error states", () => {
  assert.match(managed, /Unsaved changes/);
  assert.match(managed, /useFormStatus/);
  assert.match(managed, /state\.status === "success"/);
  assert.match(managed, /role=\{isError \? "alert" : "status"\}/);
  assert.match(managed, /aria-live=\{isError \? "assertive" : "polite"\}/);
  assert.match(managed, /beforeunload/);
});

test("submit controls prevent duplicates and stay disabled until dirty", () => {
  assert.match(managed, /disabled=\{pending \|\| \(requireDirty && !dirty\)\}/);
  assert.match(managed, /pending \? pendingLabel : label/);
});

test("all pet sections have explicit, specific save semantics", () => {
  assert.match(register, /label="Save pet details"/);
  assert.match(profile, /label="Save pet details"/);
  assert.match(profile, /label="Save behaviour and lifestyle"/);
  assert.match(profile, /"Replace photo" : "Upload photo"/);
  assert.match(profile, /label="Remove photo"/);
  assert.match(records, /label="Add record" pendingLabel="Adding…"/);
  assert.match(records, /label="Upload document" pendingLabel="Uploading…"/);
});

test("files show selection, validate before upload, and fit narrow layouts", () => {
  assert.match(managed, /Selected: \{filename\}/);
  assert.match(managed, /setCustomValidity/);
  assert.match(managed, /File must be smaller/);
  assert.match(managed, /className="block w-full min-w-0/);
  assert.match(profile, /className="mt-3 grid min-w-0 gap-3"/);
});

test("pet actions return structured success and server failure results", () => {
  assert.match(actions, /status: "success", message: success/);
  assert.match(actions, /status: "error", message: actionErrorMessage/);
  for (const message of ["Pet details saved", "Behaviour and lifestyle saved", "Photo uploaded", "Photo removed", "Record added", "Document uploaded"]) assert.match(actions, new RegExp(message));
});
