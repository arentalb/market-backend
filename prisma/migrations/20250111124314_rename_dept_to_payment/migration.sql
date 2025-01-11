/*
  Warnings:

  - You are about to drop the `PurchaseDebt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SaleDebt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PurchaseDebt" DROP CONSTRAINT "PurchaseDebt_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDebt" DROP CONSTRAINT "PurchaseDebt_purchaseInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDebt" DROP CONSTRAINT "PurchaseDebt_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "SaleDebt" DROP CONSTRAINT "SaleDebt_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SaleDebt" DROP CONSTRAINT "SaleDebt_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "SaleDebt" DROP CONSTRAINT "SaleDebt_saleInvoiceId_fkey";

-- DropTable
DROP TABLE "PurchaseDebt";

-- DropTable
DROP TABLE "SaleDebt";

-- CreateTable
CREATE TABLE "PurchasePayment" (
    "id" SERIAL NOT NULL,
    "purchaseInvoiceId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "supplierId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchasePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalePayment" (
    "id" SERIAL NOT NULL,
    "saleInvoiceId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalePayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PurchasePayment_purchaseInvoiceId_idx" ON "PurchasePayment"("purchaseInvoiceId");

-- CreateIndex
CREATE INDEX "PurchasePayment_processedBy_idx" ON "PurchasePayment"("processedBy");

-- CreateIndex
CREATE INDEX "PurchasePayment_supplierId_idx" ON "PurchasePayment"("supplierId");

-- CreateIndex
CREATE INDEX "SalePayment_saleInvoiceId_idx" ON "SalePayment"("saleInvoiceId");

-- CreateIndex
CREATE INDEX "SalePayment_processedBy_idx" ON "SalePayment"("processedBy");

-- CreateIndex
CREATE INDEX "SalePayment_customerId_idx" ON "SalePayment"("customerId");

-- AddForeignKey
ALTER TABLE "PurchasePayment" ADD CONSTRAINT "PurchasePayment_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasePayment" ADD CONSTRAINT "PurchasePayment_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchasePayment" ADD CONSTRAINT "PurchasePayment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_saleInvoiceId_fkey" FOREIGN KEY ("saleInvoiceId") REFERENCES "SaleInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
