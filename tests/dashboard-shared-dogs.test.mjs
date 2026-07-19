import assert from "node:assert/strict";

const supportedLocations = ["England", "Scotland", "Wales", "Northern Ireland", "Republic of Ireland"];
const dashboardLocation = (value) => supportedLocations.includes(value) ? value : "Location not set";
const canCreateRequest = ({ visibility, ownsDog, activeRequest }) => visibility === "PUBLIC" && !ownsDog && !activeRequest;
const canReview = ({ isOwner, isRequester, status }) => isOwner && !isRequester && status === "PENDING";
const isDualOwnership = (relationship, status) => status === "APPROVED" && ["CO_OWNER", "KEEPER"].includes(relationship);
const isContractedCare = (relationship, status) => status === "APPROVED" && ["CONTRACT_HOLDER", "FOSTER", "RESCUE", "BREEDER"].includes(relationship);

for (const location of supportedLocations) assert.equal(dashboardLocation(location), location);
assert.equal(dashboardLocation("UK"), "Location not set");
assert.equal(canCreateRequest({ visibility: "PUBLIC", ownsDog: false, activeRequest: false }), true);
assert.equal(canCreateRequest({ visibility: "PRIVATE", ownsDog: false, activeRequest: false }), false);
assert.equal(canCreateRequest({ visibility: "LINK_ONLY", ownsDog: false, activeRequest: false }), false);
assert.equal(canCreateRequest({ visibility: "PUBLIC", ownsDog: true, activeRequest: false }), false);
assert.equal(canCreateRequest({ visibility: "PUBLIC", ownsDog: false, activeRequest: true }), false);
assert.equal(canReview({ isOwner: true, isRequester: false, status: "PENDING" }), true);
assert.equal(canReview({ isOwner: true, isRequester: true, status: "PENDING" }), false);
assert.equal(canReview({ isOwner: false, isRequester: false, status: "PENDING" }), false);
assert.equal(isDualOwnership("CO_OWNER", "APPROVED"), true);
assert.equal(isDualOwnership("VETERINARY", "APPROVED"), false);
assert.equal(isDualOwnership("KEEPER", "REVOKED"), false);
assert.equal(isContractedCare("FOSTER", "APPROVED"), true);
assert.equal(isContractedCare("TRAINER", "APPROVED"), false);

console.log("dashboard and shared dogs contract tests passed");
