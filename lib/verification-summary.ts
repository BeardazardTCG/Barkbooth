export type EvidenceRecord = { verificationStatus: string; documents?: unknown[]; evidenceLinks?: unknown[] };
export function calculateVerificationSummary(records: EvidenceRecord[]) {
  return records.reduce((summary, record) => {
    if (record.verificationStatus === "VERIFIED") summary.verified++;
    else if ((record.documents?.length ?? 0) > 0 || (record.evidenceLinks?.length ?? 0) > 0) summary.evidenceSubmitted++;
    else summary.ownerDeclared++;
    return summary;
  }, { verified: 0, evidenceSubmitted: 0, ownerDeclared: 0 });
}
