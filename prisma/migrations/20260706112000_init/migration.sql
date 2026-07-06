-- CreateEnum
CREATE TYPE "OwnerStatusType" AS ENUM ('PET_OWNER', 'BREEDER', 'RESCUE', 'FOSTER', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "DogVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'LINK_ONLY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "over16" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OwnerStatusType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnerStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogIdentity" (
    "id" TEXT NOT NULL,
    "registryNumber" TEXT NOT NULL,
    "registrySequence" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "primaryRole" TEXT NOT NULL,
    "breed" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "estimatedDob" BOOLEAN NOT NULL DEFAULT false,
    "sex" TEXT,
    "colour" TEXT,
    "countryOfRegistration" TEXT,
    "visibility" "DogVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DogIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogOwnership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dogId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DogOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerStatus_userId_status_key" ON "OwnerStatus"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "DogIdentity_registryNumber_key" ON "DogIdentity"("registryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DogIdentity_registrySequence_key" ON "DogIdentity"("registrySequence");

-- CreateIndex
CREATE UNIQUE INDEX "DogOwnership_userId_dogId_key" ON "DogOwnership"("userId", "dogId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- AddForeignKey
ALTER TABLE "OwnerStatus" ADD CONSTRAINT "OwnerStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogOwnership" ADD CONSTRAINT "DogOwnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogOwnership" ADD CONSTRAINT "DogOwnership_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "DogIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
