import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const actions = await readFile(new URL("../lib/dogs/actions.ts", import.meta.url), "utf8");

function actionBody(name, nextName) {
  const start = actions.indexOf(`export async function ${name}`);
  const end = nextName ? actions.indexOf(`export async function ${nextName}`, start) : actions.length;
  assert.notEqual(start, -1, `${name} exists`);
  assert.notEqual(end, -1, `${nextName} exists after ${name}`);
  return actions.slice(start, end);
}

test("destructive actions commit database deletion before object cleanup", () => {
  const cases = [
    ["removeDogRecord", "uploadDogProfilePhoto", "prisma.dogRecord.delete"],
    ["removeDogProfilePhoto", "uploadRecordDocument", "prisma.dogProfilePhoto.delete"],
    ["removeRecordDocument", "updateBehaviourLifestyle", "prisma.dogRecordDocument.delete"],
  ];
  for (const [name, nextName, databaseDelete] of cases) {
    const body = actionBody(name, nextName);
    assert.ok(body.indexOf(databaseDelete) < body.indexOf("cleanUpStoredObjects"), `${name} deletes its database data before storage cleanup`);
  }
});

test("replacement and deletion cleanup failures are logged and absorbed", () => {
  const helperStart = actions.indexOf("async function cleanUpStoredObjects");
  const helperEnd = actions.indexOf("export async function addDogRecord", helperStart);
  const helper = actions.slice(helperStart, helperEnd);
  assert.match(helper, /Promise\.allSettled/);
  assert.match(helper, /console\.error\("Object storage cleanup failed after database mutation"/);
  assert.doesNotMatch(helper, /throw /);

  const replacement = actionBody("uploadDogProfilePhoto", "removeDogProfilePhoto");
  assert.ok(replacement.indexOf("dogProfilePhoto.upsert") < replacement.indexOf('cleanUpStoredObjects([previous.storageKey]'), "old photo cleanup follows the committed replacement");
});
