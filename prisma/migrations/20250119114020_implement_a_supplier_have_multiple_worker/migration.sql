/*
  Warnings:

  - You are about to drop the column `contactInfo` on the `Supplier` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "contactInfo",
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "SupplierWorker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierId" INTEGER NOT NULL,

    CONSTRAINT "SupplierWorker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupplierWorker_name_idx" ON "SupplierWorker"("name");

-- CreateIndex
CREATE INDEX "SupplierWorker_supplierId_idx" ON "SupplierWorker"("supplierId");

-- AddForeignKey
ALTER TABLE "SupplierWorker" ADD CONSTRAINT "SupplierWorker_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
