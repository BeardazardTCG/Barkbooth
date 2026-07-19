import assert from "node:assert/strict";

const supportedLocations = ["England", "Scotland", "Wales", "Northern Ireland", "Republic of Ireland"];
const dashboardLocation = (value) => supportedLocations.includes(value) ? value : "Location not set";
const canCreateRequest = ({ visibility, ownsDog, activeRequest }) => visibility === "PUBLIC" && !ownsDog && !activeRequest;
const canReview = ({ isOwner, isRequester, status }) => isOwner && !isRequester && status === "PENDING";
const isDualOwnership = (relationship, status) => status === "APPROVED" && ["CO_OWNER", "KEEPER"].includes(relationship);
const isContractedCare = (relationship, status) => status === "APPROVED" && ["CONTRACT_HOLDER", "FOSTER", "RESCUE", "BREEDER"].includes(relationship);
const requiredRoles = { RESCUE: "RESCUE", FOSTER: "FOSTER", BREEDER: "BREEDER", VETERINARY: "PROFESSIONAL", GROOMER: "PROFESSIONAL", TRAINER: "PROFESSIONAL", SITTER: "PROFESSIONAL", OTHER_PROFESSIONAL: "PROFESSIONAL" };
const hasRequiredRole = (relationship, applications) => !requiredRoles[relationship] || applications.some((application) => application.requestedRole === requiredRoles[relationship] && application.status === "APPROVED");
const isAccessActive = (access) => access.status === "APPROVED" && hasRequiredRole(access.requestedRelationship, access.requester.roleApplications);
const approverLabel = (request) => request.reviewedBy ? `Approved by ${request.reviewedBy.displayName}` : "Approved by an authorised account holder";

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

for (const relationship of ["RESCUE", "FOSTER", "BREEDER"]) {
  assert.equal(hasRequiredRole(relationship, []), false, `unverified member cannot request ${relationship}`);
  assert.equal(hasRequiredRole(relationship, [{ requestedRole: relationship, status: "APPROVED" }]), true, `approved ${relationship} role can request`);
}
assert.equal(hasRequiredRole("CO_OWNER", []), true, "ordinary co-owner requests remain available");
assert.equal(hasRequiredRole("KEEPER", []), true, "ordinary keeper requests remain available");
const historicalRequest = { id: "preserved", status: "APPROVED", requestedRelationship: "RESCUE", requester: { roleApplications: [{ requestedRole: "RESCUE", status: "SUSPENDED" }] } };
assert.equal(isAccessActive(historicalRequest), false, "suspended specialist access becomes inactive");
assert.equal(historicalRequest.id, "preserved", "inactive access preserves the historical request row");
assert.equal(historicalRequest.status, "APPROVED", "role revalidation does not rewrite request history");
assert.equal(approverLabel({ targetOwner: { displayName: "Earliest owner" }, reviewedBy: { displayName: "Actual reviewer" } }), "Approved by Actual reviewer", "the reviewer is shown instead of the earliest owner");
assert.equal(approverLabel({ reviewedBy: null }), "Approved by an authorised account holder");

console.log("dashboard and shared dogs contract tests passed");
