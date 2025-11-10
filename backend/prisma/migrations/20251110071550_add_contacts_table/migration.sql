/*
  Warnings:

  - You are about to drop the column `description` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `excluded` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `packages` table. All the data in the column will be lost.
  - You are about to drop the column `included` on the `packages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[packageId,customerId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "packages" DROP COLUMN "description",
DROP COLUMN "excluded",
DROP COLUMN "imageUrl",
DROP COLUMN "included",
ADD COLUMN     "exclusions" JSONB,
ADD COLUMN     "images" JSONB,
ADD COLUMN     "inclusions" JSONB,
ADD COLUMN     "overview" TEXT;

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_packageId_customerId_key" ON "reviews"("packageId", "customerId");
