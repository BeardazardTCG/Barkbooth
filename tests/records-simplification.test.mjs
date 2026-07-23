import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalog = await readFile(new URL("../lib/records/catalog.ts", import.meta.url), "utf8");
const records = await readFile(new URL("../components/records/record-components.tsx", import.meta.url), "utf8");
const profile = await readFile(new URL("../app/dogs/[registryNumber]/page.tsx", import.meta.url), "utf8");
const actions = await readFile(new URL("../lib/dogs/actions.ts", import.meta.url), "utf8");

assert.doesNotMatch(records, />Provider</);
assert.doesNotMatch(records, /Issue date|Expiry date|Valid dates/);
assert.match(records, /requireDirty=\{false\}/, "Add record remains submit-enabled so browser validation and the server action can run");
assert.match(catalog, /The Kennel Club – Agility/);
assert.match(catalog, /Search and Rescue/);
assert.match(catalog, /Kennel Club\/BVA Hip Dysplasia Scheme/);
assert.match(catalog, /Embark DNA health test/);
assert.match(catalog, /deprecatedRecordCategories.*"IDENTITY"/s);
assert.doesNotMatch(actions.match(/const recordCategories = .*;/)?.[0] ?? "", /IDENTITY|WORKING_QUALIFICATIONS/);
assert.match(profile, /Microchip number/);
assert.match(profile, /Last vaccination date/);
assert.match(profile, /These permanent details do not expire/);
assert.doesNotMatch(profile, /Awards Summary|Registry Status|Registry status/);
assert.match(profile, /Back to records/);
