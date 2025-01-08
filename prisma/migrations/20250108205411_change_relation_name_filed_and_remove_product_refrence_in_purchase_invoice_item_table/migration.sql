/*
  Warnings:

  - You are about to drop the column `productId` on the `PurchaseInvoiceItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PurchaseInvoiceItem" DROP CONSTRAINT "PurchaseInvoiceItem_productId_fkey";

-- AlterTable
ALTER TABLE "PurchaseInvoiceItem" DROP COLUMN "productId";
