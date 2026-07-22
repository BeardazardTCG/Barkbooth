import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const catalogue = readFileSync(new URL("../lib/dog-breeds.ts", import.meta.url), "utf8");
const selector = readFileSync(new URL("../components/breed-selector.tsx", import.meta.url), "utf8");
const breeds = catalogue.match(/const breedList = `([\s\S]*?)`/)[1].trim().split("\n");

test("breed catalogue is broad and contains representative breeds", () => {
  assert.ok(breeds.length >= 300, `expected at least 300 breeds, found ${breeds.length}`);
  for (const breed of ["Affenpinscher", "Cane Corso", "Labrador Retriever", "Xoloitzcuintle", "Yorkshire Terrier"]) {
    assert.ok(breeds.includes(breed), `${breed} is missing`);
  }
  assert.equal(new Set(breeds).size, breeds.length, "breed catalogue contains duplicates");
});

test("selector keeps searchable primary and multi-breed controls", () => {
  assert.match(selector, /list="dog-breed-options"/);
  assert.match(selector, /type="search"/);
  assert.match(selector, /type="checkbox" name="breedMix"/);
  assert.match(selector, /name="isMixedBreed"/);
});
