import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const managed = await readFile(new URL("../components/forms/managed-form.tsx", import.meta.url), "utf8");
const register = await readFile(new URL("../app/register-dog/register-dog-form.tsx", import.meta.url), "utf8");
const profile = await readFile(new URL("../app/dogs/[registryNumber]/page.tsx", import.meta.url), "utf8");
const records = await readFile(new URL("../components/records/record-components.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../lib/dogs/actions.ts", import.meta.url), "utf8");
const actionResults = await readFile(new URL("../lib/forms/action-result.ts", import.meta.url), "utf8");
const { confirmDestructiveAction, emptyFileFieldState, fileFieldState, formStatusMessage, visibleActionResult } = await import("../lib/forms/action-result.ts");
const { selectedDogTypes, selectedSex } = await import("../lib/dogs/profile-options.ts");
const { breedSelectionFromProps } = await import("../lib/dogs/breed-selection.ts");

test("shared form system exposes dirty, pending, success, and error states", () => {
  assert.match(actionResults, /Unsaved changes/);
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
  assert.match(register, /label="Create pet profile"/);
  assert.match(profile, /label="Save pet details"/);
  assert.match(profile, /label="Save behaviour and lifestyle"/);
  assert.match(profile, /"Replace photo" : "Upload photo"/);
  assert.match(profile, /label="Remove photo"/);
  assert.match(records, /label="Add record" pendingLabel="Adding…"/);
  assert.match(records, /label="Upload document" pendingLabel="Uploading…"/);
});

test("files show selection, validate before upload, and fit narrow layouts", () => {
  assert.match(managed, /Selected: \{fileState\.filename\}/);
  assert.match(managed, /setCustomValidity/);
  assert.match(actionResults, /File must be smaller/);
  assert.match(managed, /className="block w-full min-w-0/);
  assert.match(profile, /className="mt-3 grid min-w-0 gap-3"/);
});

test("profile edits preserve fields omitted from FormData", () => {
  const updateStart = actions.indexOf("async function updatePetDetailsImpl");
  const updateEnd = actions.indexOf("async function cleanUpStoredObjects", updateStart);
  const update = actions.slice(updateStart, updateEnd);
  for (const field of ["dogTypesPresent", "breedFieldsPresent", "estimatedDobPresent", "dnaConfirmed", "dateOfBirth", "sex", "colour", "countryOfRegistration", "visibility"]) {
    assert.match(update, new RegExp(`formData\\.has\\("${field}"\\)`), `${field} is only changed when its control is submitted`);
  }
  assert.match(update, /data\.primaryRole = dogTypes\[0\]/, "name-only edits preserve dogTypes and primaryRole");
  assert.match(update, /if \(formData\.has\("breedFieldsPresent"\)\) \{[\s\S]*data\.isMixedBreed[\s\S]*data\.breedMix/, "unrelated edits preserve mixed breed metadata");
  assert.match(update, /if \(formData\.has\("estimatedDobPresent"\)\) data\.estimatedDob/, "unrelated edits preserve estimated DOB");
});

test("success remains visible without focus theft and errors receive focus", () => {
  assert.match(managed, /state\.status === "error" \|\| \(state\.status === "success" && focusSuccess\)/);
  assert.match(managed, /if \(state\.message\) notify\(state\.message\)/);
  assert.match(managed, /else router\.refresh\(\)/);
  assert.doesNotMatch(managed, /if \(state\.status === "idle"\) return;\s*statusRef\.current\?\.focus/);
});

test("a successful save becomes unsaved after the next edit", () => {
  const success = { status: "success", message: "Pet details saved" };
  assert.deepEqual(visibleActionResult(success, false), success);
  assert.deepEqual(visibleActionResult(success, true), { status: "idle" });
  assert.match(managed, /setEditedAfterSuccess\(true\)/);
  assert.match(managed, /setEditedAfterSuccess\(true\);\s*dismiss\(\)/);
});

test("empty dog types fail rather than leaving a contradictory primary role", () => {
  assert.throws(() => selectedDogTypes([]), /Select at least one dog type/);
  assert.deepEqual(selectedDogTypes(["Companion", "Companion", "Working"]), ["Companion", "Working"]);
  assert.throws(() => selectedDogTypes(["Injected role"]), /supported dog types/);
  assert.throws(() => selectedDogTypes(["Companion", "Injected role"]), /supported dog types/);
  assert.match(actions, /dogTypes = selectedDogTypes\(formData\.getAll\("dogTypes"\)\)/, "registration enforces the same non-empty rule");
});

test("registration and editing share validated sex options", () => {
  assert.equal(selectedSex("Male"), "Male");
  assert.equal(selectedSex(""), null);
  assert.equal(selectedSex("Legacy value", "Legacy value"), "Legacy value");
  assert.throws(() => selectedSex("Injected value"), /supported sex option/);
  assert.match(register, /sexOptions\.map/);
  assert.match(profile, /sexOptions\.map/);
});

test("breed selection derives fresh controlled state when server props change", async () => {
  const before = breedSelectionFromProps({ initialBreed: "Labrador Retriever" });
  const after = breedSelectionFromProps({ mixedBreed: true, initialBreed: "Mixed Breed", initialBreedMix: "Poodle, Spaniel" });
  assert.notDeepEqual(after, before);
  assert.deepEqual(after, { isMixed: true, primaryBreed: "Mixed Breed", selected: ["Poodle", "Spaniel"] });
  assert.match(await readFile(new URL("../components/breed-selector.tsx", import.meta.url), "utf8"), /useEffect\(\(\) => \{[\s\S]*breedSelectionFromProps/);
});

test("file UI state resets with successful reset and MIME validation remains authoritative on the server", () => {
  assert.match(managed, /setResetVersion\(\(version\) => version \+ 1\)/);
  const selected = fileFieldState({ name: "too-large.pdf", size: 11 * 1024 * 1024 }, 10 * 1024 * 1024);
  assert.equal(selected.filename, "too-large.pdf");
  assert.match(selected.error, /smaller than 10 MB/);
  assert.deepEqual(emptyFileFieldState, { filename: "No file selected", error: "" });
  assert.match(managed, /setFileState\(emptyFileFieldState\)/);
  assert.match(managed, /inputRef\.current\?\.setCustomValidity\(""\)/);
  assert.match(managed, /Browsers may omit or vary File\.type/);
});

test("destructive pet actions require explicit confirmation", () => {
  let called = false;
  assert.equal(confirmDestructiveAction("Remove?", () => false), false);
  assert.equal(confirmDestructiveAction("Remove?", () => { called = true; return true; }), true);
  assert.equal(called, true);
  assert.match(managed, /confirmDestructiveAction\(confirmMessage, window\.confirm\)/);
  assert.match(profile, /confirmMessage="Remove this profile photo\?/);
  assert.match(records, /confirmMessage=\{`Remove \$\{document\.fileName\}/);
  assert.match(records, /Remove this record and its \$\{record\.documents\.length\} attached document/);
});

test("pending announcements are action-specific and success is outside the refreshed subtree", async () => {
  assert.match(register, /pendingMessage="Creating…"/);
  assert.match(profile, /pendingMessage="Uploading…"/);
  assert.match(profile, /pendingMessage="Removing…"/);
  assert.match(records, /pendingMessage="Adding…"/);
  assert.match(records, /pendingMessage="Uploading…"/);
  assert.equal(formStatusMessage(true, "Uploading…", { status: "idle" }, true), "Uploading…");
  assert.equal(formStatusMessage(false, "Saving…", { status: "idle" }, true), "Unsaved changes");
  assert.match(managed, /formStatusMessage\(pending, pendingMessage, state, dirty\)/);
  assert.match(await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"), /<FormFeedbackProvider><SiteChrome/);
});

test("pet actions return structured success and server failure results", () => {
  assert.match(actions, /status: "success", message: success/);
  assert.match(actions, /status: "error", message: actionErrorMessage/);
  for (const message of ["Pet details saved", "Behaviour and lifestyle saved", "Photo uploaded", "Photo removed", "Record added", "Document uploaded"]) assert.match(actions, new RegExp(message));
});
