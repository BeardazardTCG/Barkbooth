ALTER TABLE "Competition" ADD COLUMN "cancelledAt" TIMESTAMP(3), ADD COLUMN "cancelledById" TEXT, ADD COLUMN "cancellationReason" VARCHAR(500);
ALTER TABLE "CompetitionResult" ALTER COLUMN "publishedAt" DROP NOT NULL;
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "Competition_cancelledById_idx" ON "Competition"("cancelledById");
