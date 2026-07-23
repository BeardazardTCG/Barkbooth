import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const registration = await readFile(new URL("../app/register-dog/register-dog-form.tsx", import.meta.url), "utf8");
const registrationPage = await readFile(new URL("../app/register-dog/page.tsx", import.meta.url), "utf8");
const profile = await readFile(new URL("../app/dogs/[registryNumber]/page.tsx", import.meta.url), "utf8");
const records = await readFile(new URL("../components/records/record-components.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

assert.equal((registrationPage.match(/<Section/g) ?? []).length, 1, "registration intro and form use one compact section");
assert.match(registration, /defaultChecked=\{type === "Companion"\}/, "common dog type is preselected");
assert.match(registration, /<details[\s\S]*Optional details/, "non-essential fields are progressively disclosed");
assert.match(registration, /sticky bottom-\[4\.5rem\]/, "mobile save action remains reachable");
assert.match(records, /if \(!records\.length\) return null/, "empty record categories do not create long placeholder stacks");
assert.match(records, /<details><summary[^>]*>Add a record/, "record form is collapsed until requested");
assert.doesNotMatch(profile, /Awards Summary|Registry Status/);
assert.match(styles, /grid-template-columns: repeat\(5/, "five mobile destinations use five equal columns");
assert.match(styles, /scroll-behavior: smooth/);
