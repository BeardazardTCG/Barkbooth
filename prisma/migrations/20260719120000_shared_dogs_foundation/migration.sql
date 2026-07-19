CREATE TYPE "DogAccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'REVOKED');
CREATE TYPE "DogRelationshipType" AS ENUM ('CO_OWNER', 'KEEPER', 'CONTRACT_HOLDER', 'FOSTER', 'RESCUE', 'BREEDER', 'VETERINARY', 'GROOMER', 'TRAINER', 'SITTER', 'OTHER_PROFESSIONAL');
CREATE TYPE "DogAccessLevel" AS ENUM ('VIEW', 'CONTRIBUTE', 'MANAGE');

CREATE TABLE "DogAccessRequest" (
  "id" TEXT NOT NULL,
  "dogId" TEXT NOT NULL,
  "requesterUserId" TEXT NOT NULL,
  "targetOwnerUserId" TEXT NOT NULL,
  "requestedRelationship" "DogRelationshipType" NOT NULL,
  "requestedAccessLevel" "DogAccessLevel" NOT NULL DEFAULT 'VIEW',
  "status" "DogAccessRequestStatus" NOT NULL DEFAULT 'PENDING',
  "message" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "reviewedById" TEXT,
  "revokedAt" TIMESTAMP(3),
  "revokedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DogAccessRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "DogAccessRequest_dogId_status_idx" ON "DogAccessRequest"("dogId", "status");
CREATE INDEX "DogAccessRequest_requesterUserId_status_idx" ON "DogAccessRequest"("requesterUserId", "status");
CREATE INDEX "DogAccessRequest_targetOwnerUserId_status_idx" ON "DogAccessRequest"("targetOwnerUserId", "status");
CREATE UNIQUE INDEX "DogAccessRequest_one_active_request_idx" ON "DogAccessRequest"("dogId", "requesterUserId") WHERE "status" IN ('PENDING', 'APPROVED');
ALTER TABLE "DogAccessRequest" ADD CONSTRAINT "DogAccessRequest_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "DogIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DogAccessRequest" ADD CONSTRAINT "DogAccessRequest_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DogAccessRequest" ADD CONSTRAINT "DogAccessRequest_targetOwnerUserId_fkey" FOREIGN KEY ("targetOwnerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DogAccessRequest" ADD CONSTRAINT "DogAccessRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DogAccessRequest" ADD CONSTRAINT "DogAccessRequest_revokedById_fkey" FOREIGN KEY ("revokedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
