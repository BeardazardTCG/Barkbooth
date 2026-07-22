CREATE TABLE "DogProfilePhoto" (
  "id" TEXT NOT NULL,
  "dogId" TEXT NOT NULL,
  "uploadedById" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DogProfilePhoto_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "DogRecordDocument" (
  "id" TEXT NOT NULL,
  "recordId" TEXT NOT NULL,
  "uploadedById" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "contentType" TEXT NOT NULL,
  "sizeBytes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DogRecordDocument_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DogProfilePhoto_dogId_key" ON "DogProfilePhoto"("dogId");
CREATE UNIQUE INDEX "DogProfilePhoto_storageKey_key" ON "DogProfilePhoto"("storageKey");
CREATE INDEX "DogProfilePhoto_uploadedById_idx" ON "DogProfilePhoto"("uploadedById");
CREATE UNIQUE INDEX "DogRecordDocument_storageKey_key" ON "DogRecordDocument"("storageKey");
CREATE INDEX "DogRecordDocument_recordId_idx" ON "DogRecordDocument"("recordId");
CREATE INDEX "DogRecordDocument_uploadedById_idx" ON "DogRecordDocument"("uploadedById");
ALTER TABLE "DogProfilePhoto" ADD CONSTRAINT "DogProfilePhoto_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "DogIdentity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DogProfilePhoto" ADD CONSTRAINT "DogProfilePhoto_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DogRecordDocument" ADD CONSTRAINT "DogRecordDocument_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DogRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DogRecordDocument" ADD CONSTRAINT "DogRecordDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
