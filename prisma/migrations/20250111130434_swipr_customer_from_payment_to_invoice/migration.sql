/*
  Warnings:

  - You are about to drop the column `supplierId` on the `PurchasePayment` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `SalePayment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PurchasePayment" DROP CONSTRAINT "PurchasePayment_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "SalePayment" DROP CONSTRAINT "SalePayment_customerId_fkey";

-- DropIndex
DROP INDEX "PurchasePayment_supplierId_idx";

-- DropIndex
DROP INDEX "SalePayment_customerId_idx";

-- AlterTable
ALTER TABLE "PurchasePayment" DROP COLUMN "supplierId";

-- AlterTable
ALTER TABLE "SaleInvoice" ADD COLUMN     "customerId" INTEGER;

-- AlterTable
ALTER TABLE "SalePayment" DROP COLUMN "customerId";

-- AddForeignKey
ALTER TABLE "SaleInvoice" ADD CONSTRAINT "SaleInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
