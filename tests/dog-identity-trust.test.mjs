import assert from "node:assert/strict";

function canViewDogIdentity(visibility, isOwner) {
  return visibility === "PUBLIC" || isOwner;
}

function canViewPrivateDetails(isOwner, hasSharedView) {
  return isOwner || hasSharedView;
}

function behaviourIndicatorState(behaviourLifestyle, rescueVerified) {
  if (!behaviourLifestyle) return "inactive";
  return behaviourLifestyle.assessmentSource === "VERIFIED_RESCUE_ASSESSED" && rescueVerified ? "verified" : "owner";
}

function behaviourCounts(behaviourState) {
  return {
    verified: behaviourState === "verified" ? 1 : 0,
    ownerDeclared: behaviourState === "owner" ? 1 : 0,
  };
}

function normaliseNeuteredSpayed(value) {
  return ["YES", "NO", "UNKNOWN"].includes(value) ? value : "UNKNOWN";
}

assert.equal(canViewDogIdentity("PUBLIC", false), true, "PUBLIC allows anonymous access");
assert.equal(canViewDogIdentity("PRIVATE", false), false, "PRIVATE anonymous access is hidden");
assert.equal(canViewDogIdentity("PRIVATE", true), true, "PRIVATE owner access is allowed");
assert.equal(canViewDogIdentity("LINK_ONLY", false), false, "LINK_ONLY remains owner-only until share tokens exist");
assert.equal(canViewDogIdentity("LINK_ONLY", true), true, "LINK_ONLY owner access is allowed");
assert.equal(canViewPrivateDetails(false, false), false, "signed-out public viewers cannot see private details");
assert.equal(canViewPrivateDetails(true, false), true, "owners retain full profile access");
assert.equal(canViewPrivateDetails(false, true), true, "authorised shared viewers retain full profile access");

assert.equal(behaviourIndicatorState(null, true), "inactive", "missing behaviour is inactive");
assert.deepEqual(behaviourCounts("inactive"), { verified: 0, ownerDeclared: 0 }, "inactive behaviour is not counted");
assert.equal(behaviourIndicatorState({ assessmentSource: "OWNER_DECLARED" }, true), "owner", "owner-declared behaviour is owner state");
assert.deepEqual(behaviourCounts("owner"), { verified: 0, ownerDeclared: 1 }, "owner behaviour is owner-declared only");
assert.equal(behaviourIndicatorState({ assessmentSource: "VERIFIED_RESCUE_ASSESSED" }, true), "verified", "verified rescue behaviour requires approved rescue");
assert.deepEqual(behaviourCounts("verified"), { verified: 1, ownerDeclared: 0 }, "verified behaviour is verified only");
assert.equal(behaviourIndicatorState({ assessmentSource: "VERIFIED_RESCUE_ASSESSED" }, false), "owner", "unapproved rescue assessment is not verified");

assert.equal(normaliseNeuteredSpayed("YES"), "YES");
assert.equal(normaliseNeuteredSpayed("NO"), "NO");
assert.equal(normaliseNeuteredSpayed("UNKNOWN"), "UNKNOWN");
assert.equal(normaliseNeuteredSpayed("<script>"), "UNKNOWN", "invalid neuter status is not persisted");

console.log("dog identity trust contract tests passed");
