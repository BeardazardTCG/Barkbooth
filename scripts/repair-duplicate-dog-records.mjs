import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const strong = { NOT_SUBMITTED: 0, PENDING: 1, REJECTED: 2, VERIFIED: 3 };
const target = "kennel club registration";
const norm = (v) => (v || "").trim().replace(/\s+/g, " ").toLowerCase();
function mergedNotes(records, conflicts) { const bits = records.map(r => r.notes).filter(Boolean); if (conflicts.length) bits.push(`Manual review: conflicting duplicate Kennel Club registration data retained from records ${conflicts.map(r=>r.id).join(", ")}.`); return [...new Set(bits)].join("\n\n") || null; }
export async function repairDuplicateKennelClubRecords(client = prisma) {
  const records = await client.dogRecord.findMany({ where: { category: "ACTIVITIES_WORK" }, include: { documents: true, evidenceLinks: true }, orderBy: [{ dogId: "asc" }, { createdAt: "asc" }] });
  const groups = new Map();
  for (const r of records) if (norm(r.normalizedRecordType || r.recordType) === target) { const k = `${r.dogId}:ACTIVITIES_WORK:${target}`; groups.set(k, [...(groups.get(k) || []), r]); }
  const result = { groups: 0, removed: 0, manualReview: 0, documentsMoved: 0, evidenceLinksMoved: 0 };
  for (const group of groups.values()) {
    if (group.length < 2) continue; result.groups++;
    const nonEmpty = (r) => (r.referenceNumber?1:0)+(r.notes?1:0)+r.documents.length+r.evidenceLinks.length+strong[r.verificationStatus];
    group.sort((a,b)=> nonEmpty(b)-nonEmpty(a) || a.createdAt-b.createdAt);
    const canonical = group[0]; const duplicates = group.slice(1);
    const refs = [...new Set(group.map(r=>r.referenceNumber).filter(Boolean))];
    const conflicts = refs.length > 1 ? duplicates.filter(r=>r.referenceNumber && r.referenceNumber !== canonical.referenceNumber) : [];
    if (conflicts.length) result.manualReview++;
    await client.$transaction(async tx => {
      for (const d of duplicates) {
        for (const doc of d.documents) { await tx.dogRecordDocument.update({ where: { id: doc.id }, data: { recordId: canonical.id } }); result.documentsMoved++; }
        for (const link of d.evidenceLinks) { await tx.dogRecordEvidenceLink.update({ where: { id: link.id }, data: { recordId: canonical.id } }); result.evidenceLinksMoved++; }
      }
      await tx.dogRecord.update({ where: { id: canonical.id }, data: { systemGenerated: true, normalizedRecordType: target, referenceNumber: canonical.referenceNumber || refs[0] || null, verificationStatus: group.map(r=>r.verificationStatus).sort((a,b)=>strong[b]-strong[a])[0], notes: mergedNotes(group, conflicts) } });
      for (const d of duplicates) if (!conflicts.some(c=>c.id===d.id)) { await tx.dogRecord.delete({ where: { id: d.id } }); result.removed++; }
    });
  }
  return result;
}
if (import.meta.url === `file://${process.argv[1]}`) repairDuplicateKennelClubRecords().then(r=>console.log(JSON.stringify(r,null,2))).finally(()=>prisma.$disconnect());
