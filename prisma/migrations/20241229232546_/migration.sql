/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "JobListing" DROP CONSTRAINT "JobListing_userId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_authorId_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "profile" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "dob" DROP NOT NULL,
ALTER COLUMN "career" DROP NOT NULL,
ALTER COLUMN "social_media_links" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "zip" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobListing" ADD CONSTRAINT "JobListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
