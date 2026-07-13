-- Additive dog identity refinement: behaviour/lifestyle trust model and primary card neuter status.
ALTER TYPE "DogRecordCategory" ADD VALUE IF NOT EXISTS 'ACTIVITIES_WORK';

CREATE TYPE "BehaviourAnswer" AS ENUM ('YES', 'NO', 'UNKNOWN');
CREATE TYPE "BehaviourAssessmentSource" AS ENUM ('OWNER_DECLARED', 'VERIFIED_RESCUE_ASSESSED');

ALTER TABLE "DogIdentity" ADD COLUMN "neuteredSpayed" TEXT;

CREATE TABLE "DogBehaviourLifestyle" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "assessmentSource" "BehaviourAssessmentSource" NOT NULL DEFAULT 'OWNER_DECLARED',
    "reactive" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "foodAggression" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "resourceGuarding" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "separationAnxiety" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "highPreyDrive" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "escapeArtist" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "goodWithChildren" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "goodWithDogs" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "goodWithCats" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "goodWithLivestock" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "friendlyWithStrangers" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "reliableOffLead" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "recallTrained" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "crateTrained" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "muzzleTrained" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "neuteredSpayed" "BehaviourAnswer" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DogBehaviourLifestyle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DogBehaviourLifestyle_dogId_key" ON "DogBehaviourLifestyle"("dogId");
CREATE INDEX "DogBehaviourLifestyle_assessmentSource_idx" ON "DogBehaviourLifestyle"("assessmentSource");
ALTER TABLE "DogBehaviourLifestyle" ADD CONSTRAINT "DogBehaviourLifestyle_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "DogIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
