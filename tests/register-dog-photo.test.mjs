import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const actions = await readFile(new URL("../lib/dogs/actions.ts", import.meta.url), "utf8");
const form = await readFile(new URL("../app/register-dog/register-dog-form.tsx", import.meta.url), "utf8");

function section(startText, endText) {
  const start = actions.indexOf(startText);
  const end = actions.indexOf(endText, start);
  assert.notEqual(start, -1, `${startText} exists`);
  assert.notEqual(end, -1, `${endText} exists after ${startText}`);
  return actions.slice(start, end);
}

const storePhoto = section("async function storeDogProfilePhoto", "export async function registerDog");
const registration = section("export async function registerDog", "const recordCategories");
const replacement = section("export async function uploadDogProfilePhoto", "export async function removeDogProfilePhoto");
const cleanup = section("async function cleanUpStoredObjects", "export async function addDogRecord");

test("registration form keeps an optional multipart profile photo field", () => {
  assert.match(form, /encType="multipart\/form-data"/);
  assert.match(form, /type="file" name="photo"/);
  assert.match(form, /accept="image\/jpeg,image\/png,image\/webp"/);
  assert.doesNotMatch(form, /type="file" name="photo"[^>]*required/);
});

test("registration without a photo bypasses photo storage and row creation", () => {
  assert.match(registration, /const hasPhoto = hasOptionalUpload\(photoValue\)/);
  assert.match(registration, /const photo = hasPhoto \? await storeDogProfilePhoto[\s\S]*: null/);
  assert.match(registration, /if \(photo\) \{[\s\S]*dogProfilePhoto\.create/);
});

test("registration and replacement share validation and storage", () => {
  assert.match(storePhoto, /validateUpload\(value, imageContentTypes, MAX_PROFILE_PHOTO_BYTES\)/);
  assert.match(storePhoto, /storageKey\(folder, file\.type\)/);
  assert.match(storePhoto, /await putObject\(key, bytes, file\.type\)/);
  assert.match(registration, /storeDogProfilePhoto\(photoValue, "dogs\/registrations\/profile"\)/);
  assert.match(replacement, /storeDogProfilePhoto\(formData\.get\("photo"\), `dogs\/\$\{dogId\}\/profile`\)/);
  assert.equal((actions.match(/validateUpload\([^\n]*imageContentTypes, MAX_PROFILE_PHOTO_BYTES/g) ?? []).length, 1);
});

test("invalid MIME and oversized registration photos use existing validation", () => {
  assert.match(storePhoto, /imageContentTypes/);
  assert.match(storePhoto, /MAX_PROFILE_PHOTO_BYTES/);
});

test("the photo row and dog are committed together after upload succeeds", () => {
  const upload = registration.indexOf("await storeDogProfilePhoto");
  const photoCreate = registration.indexOf("await tx.dogProfilePhoto.create");
  assert.ok(upload < registration.indexOf("prisma.$transaction"), "storage upload finishes before opening the database transaction");
  assert.ok(upload < photoCreate, "a failed upload cannot create a profile photo row");
  assert.ok(photoCreate < registration.indexOf("return registeredDog"));
});

test("a database failure rolls the uploaded object back without hiding its error", () => {
  assert.match(registration, /uploadedPhotoKey = photo\?\.storageKey \?\? null/);
  assert.match(registration, /catch \(error\) \{[\s\S]*cleanUpStoredObjects\(\[uploadedPhotoKey\], "rollbackDogRegistrationPhotoUpload"\)[\s\S]*throw error/);
  assert.match(registration, /redirect\(`\/dogs\/\$\{dog\.registryNumber\}`\)/);
});

test("registration rollback uses the all-settled logged cleanup implementation", () => {
  assert.match(cleanup, /Promise\.allSettled/);
  assert.match(cleanup, /console\.error\("Object storage cleanup failed after database mutation"/);
  assert.doesNotMatch(cleanup, /throw /);
  assert.match(registration, /await cleanUpStoredObjects/);
});
