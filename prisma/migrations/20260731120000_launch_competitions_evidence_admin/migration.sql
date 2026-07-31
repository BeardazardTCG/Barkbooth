CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'ADMIN');
CREATE TYPE "CompetitionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'OPEN', 'CLOSED', 'JUDGING', 'COMPLETED', 'CANCELLED');
CREATE TYPE "CompetitionEligibility" AS ENUM ('UK_ONLY', 'INTERNATIONAL');
CREATE TYPE "CompetitionEntryStatus" AS ENUM ('SUBMITTED', 'WITHDRAWN', 'DISQUALIFIED', 'FINALIST', 'WINNER');
ALTER TABLE "User" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'MEMBER';

CREATE TABLE "DogRecordEvidenceLink" ("id" TEXT NOT NULL, "recordId" TEXT NOT NULL, "addedById" TEXT NOT NULL, "providerLabel" VARCHAR(120) NOT NULL, "url" VARCHAR(2048) NOT NULL, "referenceNumber" VARCHAR(160), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "DogRecordEvidenceLink_pkey" PRIMARY KEY ("id"));
CREATE INDEX "DogRecordEvidenceLink_recordId_idx" ON "DogRecordEvidenceLink"("recordId");
CREATE INDEX "DogRecordEvidenceLink_addedById_idx" ON "DogRecordEvidenceLink"("addedById");
ALTER TABLE "DogRecordEvidenceLink" ADD CONSTRAINT "DogRecordEvidenceLink_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DogRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DogRecordEvidenceLink" ADD CONSTRAINT "DogRecordEvidenceLink_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "Competition" ("id" TEXT NOT NULL, "slug" VARCHAR(120) NOT NULL, "title" VARCHAR(160) NOT NULL, "theme" VARCHAR(160) NOT NULL, "description" TEXT NOT NULL, "status" "CompetitionStatus" NOT NULL DEFAULT 'DRAFT', "opensAt" TIMESTAMP(3) NOT NULL, "closesAt" TIMESTAMP(3) NOT NULL, "resultPublishedAt" TIMESTAMP(3), "eligibility" "CompetitionEligibility" NOT NULL DEFAULT 'UK_ONLY', "entryFeePence" INTEGER NOT NULL DEFAULT 0, "maxEntriesPerDog" INTEGER NOT NULL DEFAULT 1, "prizeSummary" TEXT NOT NULL, "rules" TEXT NOT NULL, "rulesVersion" VARCHAR(40) NOT NULL DEFAULT '1', "imageGuidelines" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Competition_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Competition_slug_key" ON "Competition"("slug");
CREATE INDEX "Competition_status_opensAt_closesAt_idx" ON "Competition"("status", "opensAt", "closesAt");

CREATE TABLE "CompetitionEntry" ("id" TEXT NOT NULL, "competitionId" TEXT NOT NULL, "dogId" TEXT NOT NULL, "submittedById" TEXT NOT NULL, "caption" VARCHAR(300), "storageKey" TEXT NOT NULL, "fileName" TEXT NOT NULL, "contentType" TEXT NOT NULL, "sizeBytes" INTEGER NOT NULL, "status" "CompetitionEntryStatus" NOT NULL DEFAULT 'SUBMITTED', "profileCompleteness" INTEGER NOT NULL, "rulesVersion" VARCHAR(40) NOT NULL, "rulesAcceptedAt" TIMESTAMP(3) NOT NULL, "imageUseConsentAt" TIMESTAMP(3) NOT NULL, "moderationReason" VARCHAR(500), "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "CompetitionEntry_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "CompetitionEntry_storageKey_key" ON "CompetitionEntry"("storageKey");
CREATE INDEX "CompetitionEntry_competitionId_status_idx" ON "CompetitionEntry"("competitionId", "status");
CREATE INDEX "CompetitionEntry_dogId_idx" ON "CompetitionEntry"("dogId");
CREATE INDEX "CompetitionEntry_submittedById_idx" ON "CompetitionEntry"("submittedById");
ALTER TABLE "CompetitionEntry" ADD CONSTRAINT "CompetitionEntry_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompetitionEntry" ADD CONSTRAINT "CompetitionEntry_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "DogIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompetitionEntry" ADD CONSTRAINT "CompetitionEntry_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "CompetitionResult" ("id" TEXT NOT NULL, "competitionId" TEXT NOT NULL, "entryId" TEXT NOT NULL, "placement" INTEGER NOT NULL, "title" VARCHAR(160) NOT NULL, "judgeNotes" TEXT, "publishedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "CompetitionResult_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "CompetitionResult_competitionId_placement_key" ON "CompetitionResult"("competitionId", "placement");
CREATE UNIQUE INDEX "CompetitionResult_competitionId_entryId_key" ON "CompetitionResult"("competitionId", "entryId");
ALTER TABLE "CompetitionResult" ADD CONSTRAINT "CompetitionResult_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CompetitionResult" ADD CONSTRAINT "CompetitionResult_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "CompetitionEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
