import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const actions = await readFile(new URL("../lib/dogs/actions.ts", import.meta.url), "utf8");
const form = await readFile(new URL("../app/register-dog/register-dog-form.tsx", import.meta.url), "utf8");
const uploads = await readFile(new URL("../lib/uploads.ts", import.meta.url), "utf8");

function section(startText, endText) {
  const start = actions.indexOf(startText);
  const end = actions.indexOf(endText, start);
  assert.notEqual(start, -1, `${startText} exists`);
  assert.notEqual(end, -1, `${endText} exists after ${startText}`);
  return actions.slice(start, end);
}

const storePhoto = section("async function storeDogProfilePhoto", "export async function registerDog");
const registration = section("export async function registerDog", "const recordCategories");
const replacement = section("async function uploadDogProfilePhotoImpl", "async function removeDogProfilePhotoImpl");
const cleanup = section("async function cleanUpStoredObjects", "function actionErrorMessage");

const optionalPhotoSource = section("function optionalProfilePhoto", "async function storeDogProfilePhoto");
const compiledOptionalPhoto = ts.transpileModule(`${optionalPhotoSource}\nmodule.exports = optionalProfilePhoto;`, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const optionalProfilePhoto = new Function("module", "exports", compiledOptionalPhoto + "\nreturn module.exports;")({ exports: {} }, {});
const validationSource = uploads.slice(uploads.indexOf("const signatures"), uploads.indexOf("export function storageKey"));
const compiledValidation = ts.transpileModule(`${validationSource}\nmodule.exports = validateUpload;`, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const validateUpload = new Function("module", "exports", compiledValidation + "\nreturn module.exports;")({ exports: {} }, {});

function withoutDiagnostics(run) {
  const original = console.info;
  console.info = () => {};
  try {
    return run();
  } finally {
    console.info = original;
  }
}

test("registration form keeps an optional multipart profile photo field", () => {
  assert.match(form, /encType="multipart\/form-data"/);
  assert.match(form, /<FileField name="photo"/);
  assert.match(form, /accept="image\/jpeg,image\/png,image\/webp"/);
  assert.doesNotMatch(form, /<FileField name="photo"[^>]*required/);
});

test("no photo field is treated as no optional upload", () => {
  assert.equal(withoutDiagnostics(() => optionalProfilePhoto(null)), null);
});

test("an empty File with no name is treated as no optional upload", () => {
  assert.equal(withoutDiagnostics(() => optionalProfilePhoto(new File([], ""))), null);
});

test("a zero-byte File with a filename is treated as no optional upload", () => {
  assert.equal(withoutDiagnostics(() => optionalProfilePhoto(new File([], "camera.jpg", { type: "image/jpeg" }))), null);
});

test("a cancelled mobile-style file selection is treated as no optional upload", () => {
  assert.equal(withoutDiagnostics(() => optionalProfilePhoto("")), null);
});

test("valid non-empty JPEG, PNG, and WebP files pass strict upload validation", async () => {
  const fixtures = [
    ["dog.jpg", "image/jpeg", [0xff, 0xd8, 0xff]],
    ["dog.png", "image/png", [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
    ["dog.webp", "image/webp", [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]],
  ];
  for (const [name, type, bytes] of fixtures) {
    const file = new File([new Uint8Array(bytes)], name, { type });
    assert.equal(optionalProfilePhoto(file), file);
    assert.equal((await validateUpload(file, new Set([type]), 1024)).file, file);
  }
  assert.match(storePhoto, /validateUpload\(value, imageContentTypes, MAX_PROFILE_PHOTO_BYTES\)/);
});

test("an invalid non-empty upload is not mistaken for an omitted photo", async () => {
  const file = new File(["not an image"], "dog.txt", { type: "text/plain" });
  assert.equal(optionalProfilePhoto(file), file);
  await assert.rejects(validateUpload(file, new Set(["image/jpeg", "image/png", "image/webp"]), 1024), /Unsupported file type/);
  assert.match(storePhoto, /validateUpload\(value, imageContentTypes, MAX_PROFILE_PHOTO_BYTES\)/);
});

test("registration without a photo bypasses photo storage and row creation", () => {
  assert.match(registration, /photoValue = optionalProfilePhoto\(formData\.get\("photo"\)\)/);
  assert.match(registration, /const photo = photoValue \? await storeDogProfilePhoto[\s\S]*: null/);
  assert.match(registration, /if \(photo\) \{[\s\S]*dogProfilePhoto\.create/);
});

test("registration only stores a named, non-empty File", () => {
  assert.match(optionalPhotoSource, /value instanceof File/);
  assert.match(optionalPhotoSource, /!value\.name/);
  assert.match(optionalPhotoSource, /value\.size === 0/);
  assert.match(registration, /photoValue \? await storeDogProfilePhoto/);
});

test("empty optional-photo diagnostics use reason codes and no file metadata", () => {
  assert.match(optionalPhotoSource, /reason: "field-absent"/);
  assert.match(optionalPhotoSource, /reason: "selection-cancelled"/);
  assert.match(optionalPhotoSource, /reason: "empty-file-name"/);
  assert.match(optionalPhotoSource, /reason: "zero-byte-file"/);
  const diagnosticCalls = optionalPhotoSource.match(/console\.info\([^;]+;/g) ?? [];
  assert.equal(diagnosticCalls.length, 4);
  diagnosticCalls.forEach((call) => assert.match(call, /^console\.info\("Optional dog registration photo omitted", \{ reason: "[a-z-]+" \}\);$/));
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

test("failed photo validation cannot create a partial dog, ownership, or photo row", () => {
  const validation = registration.indexOf("await storeDogProfilePhoto");
  const transaction = registration.indexOf("prisma.$transaction");
  assert.ok(validation > -1 && validation < transaction);
  for (const databaseWrite of ["tx.dogIdentity.create", "tx.ownerStatus.upsert", "tx.dogIdentity.update", "tx.dogProfilePhoto.create"]) {
    assert.ok(registration.indexOf(databaseWrite) > transaction, `${databaseWrite} only runs after validation inside the transaction`);
  }
});

test("a database failure rolls the uploaded object back without hiding its error", () => {
  assert.match(registration, /uploadedPhotoKey = photo\?\.storageKey \?\? null/);
  assert.match(registration, /catch \(error\) \{[\s\S]*cleanUpStoredObjects\(\[uploadedPhotoKey\], "rollbackDogRegistrationPhotoUpload"\)[\s\S]*status: "error"/);
  assert.match(registration, /redirectTo: `\/dogs\/\$\{dog\.registryNumber\}`/);
});

test("registration rollback uses the all-settled logged cleanup implementation", () => {
  assert.match(cleanup, /Promise\.allSettled/);
  assert.match(cleanup, /console\.error\("Object storage cleanup failed after database mutation"/);
  assert.doesNotMatch(cleanup, /throw /);
  assert.match(registration, /await cleanUpStoredObjects/);
});
