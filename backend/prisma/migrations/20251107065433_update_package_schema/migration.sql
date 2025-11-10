/*
  Warnings:

  - You are about to drop the column `images` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `inclusions` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "packages" DROP COLUMN "images",
DROP COLUMN "inclusions",
DROP COLUMN "overview",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "excluded" JSONB,
ADD COLUMN     "highlights" JSONB,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "included" JSONB,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maxGroupSize" INTEGER;
