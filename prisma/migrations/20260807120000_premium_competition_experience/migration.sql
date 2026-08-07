ALTER TABLE "Competition"
  ADD COLUMN "tagline" VARCHAR(240),
  ADD COLUMN "launchMessage" VARCHAR(240),
  ADD COLUMN "heroAltText" VARCHAR(240),
  ADD COLUMN "heroFocalPosition" VARCHAR(20) NOT NULL DEFAULT 'center',
  ADD COLUMN "judgingCriteria" TEXT,
  ADD COLUMN "galleryVisible" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "CompetitionPrize" (
  "id" TEXT NOT NULL,
  "competitionId" TEXT NOT NULL,
  "placement" VARCHAR(40) NOT NULL,
  "title" VARCHAR(160),
  "description" TEXT NOT NULL,
  "valuePence" INTEGER,
  "sponsor" VARCHAR(160),
  "imageUrl" VARCHAR(500),
  "digitalAward" VARCHAR(160),
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CompetitionPrize_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CompetitionPrize_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "CompetitionPrize_competitionId_displayOrder_idx" ON "CompetitionPrize"("competitionId", "displayOrder");
