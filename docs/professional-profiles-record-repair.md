# Professional Profiles and dog-record duplicate repair runbook

Use this runbook for the PR #38 deployment that adds Professional Profiles and repairs duplicate default dog records. Do **not** claim the repair has run until these steps are completed in production.

## Required production order

1. Back up Railway PostgreSQL and retain the backup reference.
2. Merge/deploy PR #38 and apply Migration A: `20260805120000_professional_profiles_and_record_dedup`. This adds Professional Profile tables and dog-record repair metadata without the partial unique guard.
3. Run a read-only plan:
   ```bash
   node scripts/repair-duplicate-dog-records.mjs --dry-run
   ```
4. Save the dry-run JSON output. Review every `conflicts` entry and every group where `safeToApply` is `false`.
5. Resolve manual-review conflicts where needed without stripping documents/evidence from retained conflict rows.
6. Apply only safe repairs:
   ```bash
   node scripts/repair-duplicate-dog-records.mjs --apply
   ```
7. Run dry-run again and confirm `safeDuplicates`, `proposedRemovals`, `documentsToMove` and `evidenceLinksToMove` are all `0` for safe groups.
8. Only after the clean dry-run, create a separate follow-up PR containing the unique partial index migration for system-generated default-record identity.
9. Deploy/restart the application after PR #38 is deployed and the repair is complete.
10. Verify affected dog profiles no longer show repeated Activities & Work cards and that documents/evidence are still reachable from the retained records.

## Rollback considerations

- If Migration A fails, roll back using the database backup or normal migration rollback process before retrying.
- If dry-run reports conflicts, do not run `--apply` until conflicts have been reviewed.
- If `--apply` fails part-way, rerun `--dry-run`; safe groups are processed transactionally, so already-completed groups should not be proposed again.
- Do not include or apply the unique-index migration in PR #38. Create and deploy that separate follow-up PR only after dry-run output shows no remaining safe duplicates.
- Retain all dry-run/apply JSON output with the deployment record for auditability.
