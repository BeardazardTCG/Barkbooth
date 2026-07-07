-- Add optional identity foundation fields without rewriting existing dog records.
ALTER TABLE "DogIdentity" ADD COLUMN "kennelClubName" TEXT;
ALTER TABLE "DogIdentity" ADD COLUMN "isMixedBreed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DogIdentity" ADD COLUMN "breedMix" TEXT;
ALTER TABLE "DogIdentity" ADD COLUMN "dnaConfirmed" TEXT;
ALTER TABLE "DogIdentity" ADD COLUMN "dogTypes" TEXT;
