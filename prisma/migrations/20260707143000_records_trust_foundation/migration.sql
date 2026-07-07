-- CreateEnum
CREATE TYPE "DogRecordCategory" AS ENUM ('IDENTITY', 'DNA', 'HEALTH', 'CARE', 'IDENTIFICATION', 'INSURANCE', 'PEDIGREE', 'TITLES', 'WORKING_QUALIFICATIONS', 'TEMPERAMENT_TESTS', 'BREEDING_APPROVALS', 'OTHER');

-- CreateEnum
CREATE TYPE "DogRecordStatus" AS ENUM ('HAVE_RECORD', 'DO_NOT_HAVE');

-- CreateEnum
CREATE TYPE "DogRecordVerificationStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "DogRecord" (
    "id" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "category" "DogRecordCategory" NOT NULL,
    "recordType" TEXT NOT NULL,
    "provider" TEXT,
    "status" "DogRecordStatus" NOT NULL DEFAULT 'HAVE_RECORD',
    "verificationStatus" "DogRecordVerificationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "referenceNumber" TEXT,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DogRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DogRecord_dogId_category_idx" ON "DogRecord"("dogId", "category");

-- CreateIndex
CREATE INDEX "DogRecord_dogId_verificationStatus_idx" ON "DogRecord"("dogId", "verificationStatus");

-- CreateIndex
CREATE INDEX "DogRecord_category_recordType_idx" ON "DogRecord"("category", "recordType");

-- CreateIndex
CREATE INDEX "DogRecord_provider_idx" ON "DogRecord"("provider");

-- AddForeignKey
ALTER TABLE "DogRecord" ADD CONSTRAINT "DogRecord_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "DogIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
