-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('pending', 'in_progress', 'success', 'failed');

-- CreateEnum
CREATE TYPE "TransferSource" AS ENUM ('drive', 'gcs', 'gmail');

-- CreateEnum
CREATE TYPE "TransferMode" AS ENUM ('copy', 'move');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceEmail" TEXT,
    "sourceAccessToken" TEXT,
    "sourceRefreshToken" TEXT,
    "sourceExpiryDate" TIMESTAMP(3),
    "destEmail" TEXT,
    "destAccessToken" TEXT,
    "destRefreshToken" TEXT,
    "destExpiryDate" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceFileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "sourceType" "TransferSource" NOT NULL DEFAULT 'drive',
    "transferMode" "TransferMode" NOT NULL DEFAULT 'copy',
    "status" "TransferStatus" NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Transfer_userId_idx" ON "Transfer"("userId");

-- CreateIndex
CREATE INDEX "Transfer_status_idx" ON "Transfer"("status");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
