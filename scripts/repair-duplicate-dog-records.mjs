import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const strong = { NOT_SUBMITTED: 0, PENDING: 1, REJECTED: 2, VERIFIED: 3 };
const target = "kennel club registration";
const norm = (value) => (value || "").trim().replace(/\s+/g, " ").toLowerCase();
const usage = `Usage: node scripts/repair-duplicate-dog-records.mjs --dry-run\n       node scripts/repair-duplicate-dog-records.mjs --apply`;

function groupKey(record) { return `${record.dogId}:ACTIVITIES_WORK:${target}`; }
function usefulScore(record) { return (record.referenceNumber ? 1 : 0) + (record.notes ? 1 : 0) + record.documents.length + record.evidenceLinks.length + strong[record.verificationStatus]; }
function materialConflicts(canonical, candidate) {
  const conflicts = [];
  if (canonical.referenceNumber && candidate.referenceNumber && canonical.referenceNumber !== candidate.referenceNumber) conflicts.push("referenceNumber");
  if (canonical.provider && candidate.provider && canonical.provider !== candidate.provider) conflicts.push("provider");
  return conflicts;
}
function mergedNotes(records) { return [...new Set(records.map((record) => record.notes).filter(Boolean))].join("\n\n") || null; }
function strongestStatus(records) { return records.map((record) => record.verificationStatus).sort((a, b) => strong[b] - strong[a])[0]; }
function classify(group) {
  const sorted = [...group].sort((a, b) => usefulScore(b) - usefulScore(a) || new Date(a.createdAt) - new Date(b.createdAt));
  const canonical = sorted[0];
  const safe = [];
  const conflicts = [];
  for (const candidate of sorted.slice(1)) {
    const reasons = materialConflicts(canonical, candidate);
    if (reasons.length) conflicts.push({ record: candidate, reasons }); else safe.push(candidate);
  }
  const mergeRecords = [canonical, ...safe];
  const references = [...new Set(mergeRecords.map((record) => record.referenceNumber).filter(Boolean))];
  return {
    canonical,
    safe,
    conflicts,
    resultingReferenceNumber: canonical.referenceNumber || references[0] || null,
    resultingVerificationStatus: strongestStatus(mergeRecords),
    resultingNotes: mergedNotes(mergeRecords),
  };
}
function groupPlan(group) {
  const { canonical, safe, conflicts, resultingReferenceNumber, resultingVerificationStatus } = classify(group);
  return {
    dogId: canonical.dogId,
    canonicalRecordId: canonical.id,
    safeDuplicateRecordIds: safe.map((record) => record.id),
    conflictingRecordIds: conflicts.map(({ record }) => record.id),
    conflictReasons: conflicts.map(({ record, reasons }) => ({ recordId: record.id, reasons })),
    proposedDocumentMoveCount: safe.reduce((total, record) => total + record.documents.length, 0),
    proposedEvidenceLinkMoveCount: safe.reduce((total, record) => total + record.evidenceLinks.length, 0),
    resultingReferenceNumber,
    resultingVerificationStatus,
    safeToApply: safe.length > 0 && conflicts.length === 0,
  };
}
function emptySummary(dryRun) { return { totalGroups: 0, safeGroups: 0, conflictGroups: 0, safeDuplicates: 0, proposedRemovals: 0, documentsToMove: 0, evidenceLinksToMove: 0, removed: 0, documentsMoved: 0, evidenceLinksMoved: 0, dryRun }; }
function addToSummary(summary, plan) {
  summary.totalGroups++;
  if (plan.conflictingRecordIds.length) summary.conflictGroups++; else summary.safeGroups++;
  summary.safeDuplicates += plan.safeDuplicateRecordIds.length;
  summary.proposedRemovals += plan.safeDuplicateRecordIds.length;
  summary.documentsToMove += plan.proposedDocumentMoveCount;
  summary.evidenceLinksToMove += plan.proposedEvidenceLinkMoveCount;
}
async function applyPlan(client, group, plan) {
  if (!plan.safeDuplicateRecordIds.length || plan.conflictingRecordIds.length) return { removed: 0, documentsMoved: 0, evidenceLinksMoved: 0 };
  const { canonical, safe, resultingReferenceNumber, resultingVerificationStatus, resultingNotes } = classify(group);
  const counts = { removed: 0, documentsMoved: 0, evidenceLinksMoved: 0 };
  await client.$transaction(async (tx) => {
    for (const duplicate of safe) {
      for (const doc of duplicate.documents) { await tx.dogRecordDocument.update({ where: { id: doc.id }, data: { recordId: canonical.id } }); counts.documentsMoved++; }
      for (const link of duplicate.evidenceLinks) { await tx.dogRecordEvidenceLink.update({ where: { id: link.id }, data: { recordId: canonical.id } }); counts.evidenceLinksMoved++; }
    }
    await tx.dogRecord.update({ where: { id: canonical.id }, data: { systemGenerated: true, normalizedRecordType: target, referenceNumber: resultingReferenceNumber, verificationStatus: resultingVerificationStatus, notes: resultingNotes } });
    for (const duplicate of safe) { await tx.dogRecord.delete({ where: { id: duplicate.id } }); counts.removed++; }
  });
  return counts;
}
export async function repairDuplicateKennelClubRecords({ client = prisma, dryRun = false, apply = false } = {}) {
  if (dryRun === apply) throw new Error("Choose exactly one repair mode: --dry-run or --apply.");
  const records = await client.dogRecord.findMany({ where: { category: "ACTIVITIES_WORK" }, include: { documents: true, evidenceLinks: true }, orderBy: [{ dogId: "asc" }, { createdAt: "asc" }] });
  const groups = new Map();
  for (const record of records) if (norm(record.normalizedRecordType || record.recordType) === target) groups.set(groupKey(record), [...(groups.get(groupKey(record)) || []), record]);
  const plans = [];
  const summary = emptySummary(dryRun);
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const plan = groupPlan(group);
    plans.push(plan);
    addToSummary(summary, plan);
    if (apply) {
      const counts = await applyPlan(client, group, plan);
      summary.removed += counts.removed;
      summary.documentsMoved += counts.documentsMoved;
      summary.evidenceLinksMoved += counts.evidenceLinksMoved;
    }
  }
  return { mode: dryRun ? "dry-run" : "apply", summary, groups: plans };
}
function parseMode(argv) {
  const flags = argv.slice(2);
  const known = new Set(["--dry-run", "--apply"]);
  const unknown = flags.filter((flag) => !known.has(flag));
  const dryRun = flags.includes("--dry-run");
  const apply = flags.includes("--apply");
  if (unknown.length || dryRun === apply) return null;
  return { dryRun, apply };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = parseMode(process.argv);
  if (!mode) {
    console.error(usage);
    process.exitCode = 1;
  } else {
    repairDuplicateKennelClubRecords(mode).then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
  }
}
