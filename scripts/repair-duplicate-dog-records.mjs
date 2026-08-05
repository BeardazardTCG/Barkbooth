import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const strong = { NOT_SUBMITTED: 0, PENDING: 1, REJECTED: 2, VERIFIED: 3 };
const target = "kennel club registration";
const norm = (v) => (v || "").trim().replace(/\s+/g, " ").toLowerCase();
function groupKey(record) { return `${record.dogId}:ACTIVITIES_WORK:${target}`; }
function usefulScore(r) { return (r.referenceNumber ? 1 : 0) + (r.notes ? 1 : 0) + r.documents.length + r.evidenceLinks.length + strong[r.verificationStatus]; }
function materialConflicts(canonical, candidate) { const conflicts = []; if (canonical.referenceNumber && candidate.referenceNumber && canonical.referenceNumber !== candidate.referenceNumber) conflicts.push("referenceNumber"); if (canonical.provider && candidate.provider && canonical.provider !== candidate.provider) conflicts.push("provider"); return conflicts; }
function mergedNotes(records) { return [...new Set(records.map((r) => r.notes).filter(Boolean))].join("\n\n") || null; }
function classify(group) {
  const sorted = [...group].sort((a, b) => usefulScore(b) - usefulScore(a) || a.createdAt - b.createdAt);
  const canonical = sorted[0];
  const safe = [];
  const conflicts = [];
  for (const candidate of sorted.slice(1)) {
    const reasons = materialConflicts(canonical, candidate);
    if (reasons.length) conflicts.push({ record: candidate, reasons }); else safe.push(candidate);
  }
  return { canonical, safe, conflicts };
}
export async function repairDuplicateKennelClubRecords({ client = prisma, dryRun = false } = {}) {
  const records = await client.dogRecord.findMany({ where: { category: "ACTIVITIES_WORK" }, include: { documents: true, evidenceLinks: true }, orderBy: [{ dogId: "asc" }, { createdAt: "asc" }] });
  const groups = new Map();
  for (const record of records) if (norm(record.normalizedRecordType || record.recordType) === target) groups.set(groupKey(record), [...(groups.get(groupKey(record)) || []), record]);
  const result = { groups: 0, safeDuplicates: 0, removed: 0, manualReview: 0, documentsMoved: 0, evidenceLinksMoved: 0, dryRun, conflicts: [] };
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    result.groups++;
    const { canonical, safe, conflicts } = classify(group);
    result.safeDuplicates += safe.length;
    result.manualReview += conflicts.length;
    result.conflicts.push(...conflicts.map(({ record, reasons }) => ({ dogId: record.dogId, recordId: record.id, reasons })));
    if (!safe.length || dryRun) continue;
    const mergeRecords = [canonical, ...safe];
    const references = [...new Set(mergeRecords.map((r) => r.referenceNumber).filter(Boolean))];
    await client.$transaction(async (tx) => {
      for (const duplicate of safe) {
        for (const doc of duplicate.documents) { await tx.dogRecordDocument.update({ where: { id: doc.id }, data: { recordId: canonical.id } }); result.documentsMoved++; }
        for (const link of duplicate.evidenceLinks) { await tx.dogRecordEvidenceLink.update({ where: { id: link.id }, data: { recordId: canonical.id } }); result.evidenceLinksMoved++; }
      }
      await tx.dogRecord.update({ where: { id: canonical.id }, data: { systemGenerated: true, normalizedRecordType: target, referenceNumber: canonical.referenceNumber || references[0] || null, verificationStatus: mergeRecords.map((r) => r.verificationStatus).sort((a, b) => strong[b] - strong[a])[0], notes: mergedNotes(mergeRecords) } });
      for (const duplicate of safe) { await tx.dogRecord.delete({ where: { id: duplicate.id } }); result.removed++; }
    });
  }
  return result;
}
if (import.meta.url === `file://${process.argv[1]}`) repairDuplicateKennelClubRecords({ dryRun: process.argv.includes("--dry-run") }).then((r) => console.log(JSON.stringify(r, null, 2))).finally(() => prisma.$disconnect());
