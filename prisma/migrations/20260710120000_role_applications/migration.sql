CREATE TYPE "RoleApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED', 'WITHDRAWN');
CREATE TYPE "RequestedRole" AS ENUM ('BREEDER', 'RESCUE', 'FOSTER', 'PROFESSIONAL');
CREATE TYPE "ProfessionalCategory" AS ENUM ('TRAINER', 'GROOMER', 'DOG_WALKER', 'BEHAVIOURIST', 'PHOTOGRAPHER', 'VETERINARY_CARE', 'OTHER');
CREATE TYPE "PromotionTier" AS ENUM ('NONE', 'FEATURED');

CREATE TABLE "RoleApplication" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "requestedRole" "RequestedRole" NOT NULL,
  "status" "RoleApplicationStatus" NOT NULL DEFAULT 'DRAFT',
  "applicantType" TEXT,
  "organisationName" TEXT,
  "publicDisplayName" TEXT,
  "website" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "serviceArea" TEXT,
  "registrationNumber" TEXT,
  "charityNumber" TEXT,
  "insuranceDetails" TEXT,
  "qualifications" TEXT,
  "professionalCategory" "ProfessionalCategory",
  "breeds" TEXT,
  "description" TEXT,
  "evidenceNotes" TEXT,
  "submittedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "reviewedById" TEXT,
  "rejectionReason" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "featuredUntil" TIMESTAMP(3),
  "promotionTier" "PromotionTier" NOT NULL DEFAULT 'NONE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RoleApplication_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "RoleApplication_userId_idx" ON "RoleApplication"("userId");
CREATE INDEX "RoleApplication_requestedRole_idx" ON "RoleApplication"("requestedRole");
CREATE INDEX "RoleApplication_status_idx" ON "RoleApplication"("status");
CREATE INDEX "RoleApplication_organisationName_idx" ON "RoleApplication"("organisationName");
CREATE INDEX "RoleApplication_requestedRole_status_idx" ON "RoleApplication"("requestedRole", "status");
ALTER TABLE "RoleApplication" ADD CONSTRAINT "RoleApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleApplication" ADD CONSTRAINT "RoleApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
