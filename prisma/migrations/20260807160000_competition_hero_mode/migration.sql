-- Preserve existing promotional artwork without cropping by default.
ALTER TABLE "Competition" ADD COLUMN "heroImageType" VARCHAR(20) NOT NULL DEFAULT 'ARTWORK';
