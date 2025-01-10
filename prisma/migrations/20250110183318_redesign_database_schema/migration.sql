/*
  Warnings:

  - You are about to drop the column `date` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Income` table. All the data in the column will be lost.
  - You are about to drop the column `processedBy` on the `MissingProduct` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `MissingProduct` table. All the data in the column will be lost.
  - You are about to drop the column `productSellingPriceId` on the `MissingProduct` table. All the data in the column will be lost.
  - You are about to drop the column `purchasePrice` on the `ProductPurchasePrice` table. All the data in the column will be lost.
  - You are about to drop the column `debtDate` on the `PurchaseDebt` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `PurchaseDebt` table. All the data in the column will be lost.
  - You are about to drop the column `originalAmount` on the `PurchaseDebt` table. All the data in the column will be lost.
  - You are about to drop the column `remainingAmount` on the `PurchaseDebt` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `PurchaseDebt` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `workerId` on the `PurchaseInvoice` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `PurchaseReturn` table. All the data in the column will be lost.
  - You are about to drop the column `processedBy` on the `PurchaseReturn` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `PurchaseReturn` table. All the data in the column will be lost.
  - You are about to drop the column `returnDate` on the `PurchaseReturn` table. All the data in the column will be lost.
  - The `reason` column on the `PurchaseReturn` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CustomerReturn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerReturnPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSellingPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseDebtPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseInvoicePayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PurchaseReturnPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesDebt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesDebtPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesInvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesInvoiceItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SalesInvoicePayment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EmployeeExpense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EmployeeTimeShift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productPurchasePriceId` to the `MissingProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MissingProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductPurchasePrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductPurchasePrice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductUnit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `PurchaseDebt` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `PurchaseDebt` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `processedBy` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PurchaseInvoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PurchaseInvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnedBy` to the `PurchaseReturn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PurchaseReturn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UnitConversion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('OPEN', 'PARTIALLY_PAID', 'PAID', 'CANCELED');

-- CreateEnum
CREATE TYPE "PurchaseReturnReason" AS ENUM ('expired', 'other');

-- DropForeignKey
ALTER TABLE "CustomerReturn" DROP CONSTRAINT "CustomerReturn_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerReturn" DROP CONSTRAINT "CustomerReturn_productId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerReturn" DROP CONSTRAINT "CustomerReturn_productSellingPriceId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerReturnPayment" DROP CONSTRAINT "CustomerReturnPayment_customerReturnId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerReturnPayment" DROP CONSTRAINT "CustomerReturnPayment_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "MissingProduct" DROP CONSTRAINT "MissingProduct_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "MissingProduct" DROP CONSTRAINT "MissingProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "MissingProduct" DROP CONSTRAINT "MissingProduct_productSellingPriceId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSellingPrice" DROP CONSTRAINT "ProductSellingPrice_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSellingPrice" DROP CONSTRAINT "ProductSellingPrice_unitId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDebt" DROP CONSTRAINT "PurchaseDebt_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDebtPayment" DROP CONSTRAINT "PurchaseDebtPayment_debtId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDebtPayment" DROP CONSTRAINT "PurchaseDebtPayment_purchaseInvoicePaymentId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseInvoice" DROP CONSTRAINT "PurchaseInvoice_workerId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseInvoicePayment" DROP CONSTRAINT "PurchaseInvoicePayment_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseInvoicePayment" DROP CONSTRAINT "PurchaseInvoicePayment_purchaseInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseInvoicePayment" DROP CONSTRAINT "PurchaseInvoicePayment_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseReturn" DROP CONSTRAINT "PurchaseReturn_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseReturn" DROP CONSTRAINT "PurchaseReturn_productId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseReturnPayment" DROP CONSTRAINT "PurchaseReturnPayment_purchaseReturnId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseReturnPayment" DROP CONSTRAINT "PurchaseReturnPayment_userId_fkey";

-- DropForeignKey
ALTER TABLE "SalesDebt" DROP CONSTRAINT "SalesDebt_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SalesDebt" DROP CONSTRAINT "SalesDebt_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "SalesDebt" DROP CONSTRAINT "SalesDebt_salesInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "SalesDebtPayment" DROP CONSTRAINT "SalesDebtPayment_debtId_fkey";

-- DropForeignKey
ALTER TABLE "SalesDebtPayment" DROP CONSTRAINT "SalesDebtPayment_salesInvoicePaymentId_fkey";

-- DropForeignKey
ALTER TABLE "SalesInvoice" DROP CONSTRAINT "SalesInvoice_workerId_fkey";

-- DropForeignKey
ALTER TABLE "SalesInvoiceItem" DROP CONSTRAINT "SalesInvoiceItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "SalesInvoiceItem" DROP CONSTRAINT "SalesInvoiceItem_productSellingPriceId_fkey";

-- DropForeignKey
ALTER TABLE "SalesInvoiceItem" DROP CONSTRAINT "SalesInvoiceItem_salesInvoiceId_fkey";

-- DropForeignKey
ALTER TABLE "SalesInvoicePayment" DROP CONSTRAINT "SalesInvoicePayment_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SalesInvoicePayment" DROP CONSTRAINT "SalesInvoicePayment_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "SalesInvoicePayment" DROP CONSTRAINT "SalesInvoicePayment_salesInvoiceId_fkey";

-- DropIndex
DROP INDEX "MissingProduct_processedBy_idx";

-- DropIndex
DROP INDEX "MissingProduct_productSellingPriceId_idx";

-- DropIndex
DROP INDEX "ProductPurchasePrice_productId_idx";

-- DropIndex
DROP INDEX "ProductPurchasePrice_unitId_idx";

-- DropIndex
DROP INDEX "ProductUnit_unitId_idx";

-- DropIndex
DROP INDEX "PurchaseDebt_status_idx";

-- DropIndex
DROP INDEX "PurchaseInvoice_date_idx";

-- DropIndex
DROP INDEX "PurchaseInvoice_workerId_idx";

-- DropIndex
DROP INDEX "PurchaseReturn_processedBy_idx";

-- DropIndex
DROP INDEX "PurchaseReturn_returnDate_idx";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeExpense" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeTimeShift" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MissingProduct" DROP COLUMN "processedBy",
DROP COLUMN "productId",
DROP COLUMN "productSellingPriceId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "processedByUserId" INTEGER,
ADD COLUMN     "productPurchasePriceId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductPurchasePrice" DROP COLUMN "purchasePrice",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductUnit" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseDebt" DROP COLUMN "debtDate",
DROP COLUMN "notes",
DROP COLUMN "originalAmount",
DROP COLUMN "remainingAmount",
DROP COLUMN "status",
ADD COLUMN     "amount" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "supplierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseInvoice" DROP COLUMN "date",
DROP COLUMN "workerId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paidSoFar" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "processedBy" INTEGER NOT NULL,
ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseInvoiceItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseReturn" DROP COLUMN "notes",
DROP COLUMN "processedBy",
DROP COLUMN "productId",
DROP COLUMN "returnDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "moneyTakenBy" INTEGER,
ADD COLUMN     "returnedBy" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "reason",
ADD COLUMN     "reason" "PurchaseReturnReason" NOT NULL DEFAULT 'other';

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UnitConversion" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "CustomerReturn";

-- DropTable
DROP TABLE "CustomerReturnPayment";

-- DropTable
DROP TABLE "ProductSellingPrice";

-- DropTable
DROP TABLE "PurchaseDebtPayment";

-- DropTable
DROP TABLE "PurchaseInvoicePayment";

-- DropTable
DROP TABLE "PurchaseReturnPayment";

-- DropTable
DROP TABLE "SalesDebt";

-- DropTable
DROP TABLE "SalesDebtPayment";

-- DropTable
DROP TABLE "SalesInvoice";

-- DropTable
DROP TABLE "SalesInvoiceItem";

-- DropTable
DROP TABLE "SalesInvoicePayment";

-- DropEnum
DROP TYPE "PurchaseDebtStatus";

-- DropEnum
DROP TYPE "SalesDebtStatus";

-- CreateTable
CREATE TABLE "ProductSalePrice" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSalePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleInvoice" (
    "id" SERIAL NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "paidSoFar" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleInvoiceItem" (
    "id" SERIAL NOT NULL,
    "productSalePriceId" INTEGER NOT NULL,
    "saleInvoiceId" INTEGER NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleDebt" (
    "id" SERIAL NOT NULL,
    "saleInvoiceId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleDebt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleReturn" (
    "id" SERIAL NOT NULL,
    "reason" TEXT,
    "quantity" DECIMAL(18,2) NOT NULL,
    "productSalePriceId" INTEGER NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleReturn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductSalePrice_productId_unitId_effectiveDate_key" ON "ProductSalePrice"("productId", "unitId", "effectiveDate");

-- CreateIndex
CREATE INDEX "SaleInvoice_processedBy_idx" ON "SaleInvoice"("processedBy");

-- CreateIndex
CREATE INDEX "SaleInvoice_status_idx" ON "SaleInvoice"("status");

-- CreateIndex
CREATE INDEX "SaleInvoiceItem_productSalePriceId_idx" ON "SaleInvoiceItem"("productSalePriceId");

-- CreateIndex
CREATE INDEX "SaleInvoiceItem_saleInvoiceId_idx" ON "SaleInvoiceItem"("saleInvoiceId");

-- CreateIndex
CREATE INDEX "SaleDebt_saleInvoiceId_idx" ON "SaleDebt"("saleInvoiceId");

-- CreateIndex
CREATE INDEX "SaleDebt_processedBy_idx" ON "SaleDebt"("processedBy");

-- CreateIndex
CREATE INDEX "SaleDebt_customerId_idx" ON "SaleDebt"("customerId");

-- CreateIndex
CREATE INDEX "SaleReturn_productSalePriceId_idx" ON "SaleReturn"("productSalePriceId");

-- CreateIndex
CREATE INDEX "SaleReturn_processedBy_idx" ON "SaleReturn"("processedBy");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "idx_employee_userId_unique" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "EmployeeExpense_employeeId_idx" ON "EmployeeExpense"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeExpense_paymentMonth_idx" ON "EmployeeExpense"("paymentMonth");

-- CreateIndex
CREATE INDEX "MissingProduct_productPurchasePriceId_idx" ON "MissingProduct"("productPurchasePriceId");

-- CreateIndex
CREATE INDEX "MissingProduct_processedByUserId_idx" ON "MissingProduct"("processedByUserId");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "PurchaseInvoice_processedBy_idx" ON "PurchaseInvoice"("processedBy");

-- CreateIndex
CREATE INDEX "PurchaseInvoice_status_idx" ON "PurchaseInvoice"("status");

-- CreateIndex
CREATE INDEX "PurchaseReturn_productPurchasePriceId_idx" ON "PurchaseReturn"("productPurchasePriceId");

-- CreateIndex
CREATE INDEX "PurchaseReturn_returnedBy_idx" ON "PurchaseReturn"("returnedBy");

-- CreateIndex
CREATE INDEX "PurchaseReturn_moneyTakenBy_idx" ON "PurchaseReturn"("moneyTakenBy");

-- CreateIndex
CREATE INDEX "Unit_unitSymbol_idx" ON "Unit"("unitSymbol");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "MissingProduct" ADD CONSTRAINT "MissingProduct_productPurchasePriceId_fkey" FOREIGN KEY ("productPurchasePriceId") REFERENCES "ProductPurchasePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingProduct" ADD CONSTRAINT "MissingProduct_processedByUserId_fkey" FOREIGN KEY ("processedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSalePrice" ADD CONSTRAINT "ProductSalePrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSalePrice" ADD CONSTRAINT "ProductSalePrice_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleInvoice" ADD CONSTRAINT "SaleInvoice_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleInvoiceItem" ADD CONSTRAINT "SaleInvoiceItem_productSalePriceId_fkey" FOREIGN KEY ("productSalePriceId") REFERENCES "ProductSalePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleInvoiceItem" ADD CONSTRAINT "SaleInvoiceItem_saleInvoiceId_fkey" FOREIGN KEY ("saleInvoiceId") REFERENCES "SaleInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDebt" ADD CONSTRAINT "PurchaseDebt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDebt" ADD CONSTRAINT "SaleDebt_saleInvoiceId_fkey" FOREIGN KEY ("saleInvoiceId") REFERENCES "SaleInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDebt" ADD CONSTRAINT "SaleDebt_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDebt" ADD CONSTRAINT "SaleDebt_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleReturn" ADD CONSTRAINT "SaleReturn_productSalePriceId_fkey" FOREIGN KEY ("productSalePriceId") REFERENCES "ProductSalePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleReturn" ADD CONSTRAINT "SaleReturn_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_returnedBy_fkey" FOREIGN KEY ("returnedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_moneyTakenBy_fkey" FOREIGN KEY ("moneyTakenBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
