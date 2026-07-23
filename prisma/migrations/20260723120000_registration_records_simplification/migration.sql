ALTER TABLE "DogIdentity"
  ADD COLUMN "microchipNumber" TEXT,
  ADD COLUMN "vaccinated" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "lastVaccinationDate" TIMESTAMP(3);

-- Preserve historical data while presenting one Activities & Work category and no Identity category.
UPDATE "DogRecord" SET "category" = 'ACTIVITIES_WORK' WHERE "category" IN ('TITLES', 'WORKING_QUALIFICATIONS');
UPDATE "DogRecord" SET "category" = 'OTHER' WHERE "category" = 'IDENTITY';
