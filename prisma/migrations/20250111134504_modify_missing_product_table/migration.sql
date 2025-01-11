/*
  Warnings:

  - You are about to drop the column `processedByUserId` on the `MissingProduct` table. All the data in the column will be lost.
  - Added the required column `processedBy` to the `MissingProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MissingProduct" DROP CONSTRAINT "MissingProduct_processedByUserId_fkey";

-- DropIndex
DROP INDEX "MissingProduct_processedByUserId_idx";

-- AlterTable
ALTER TABLE "MissingProduct" DROP COLUMN "processedByUserId",
ADD COLUMN     "processedBy" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "MissingProduct_processedBy_idx" ON "MissingProduct"("processedBy");

-- AddForeignKey
ALTER TABLE "MissingProduct" ADD CONSTRAINT "MissingProduct_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
