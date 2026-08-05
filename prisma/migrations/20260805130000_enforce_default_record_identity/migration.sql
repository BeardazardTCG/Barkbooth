-- Apply only after scripts/repair-duplicate-dog-records.mjs --apply has completed and a follow-up --dry-run reports no safe duplicates.
CREATE UNIQUE INDEX IF NOT EXISTS "DogRecord_default_record_identity_key" ON "DogRecord"("dogId", "category", "normalizedRecordType") WHERE "systemGenerated" = true;
