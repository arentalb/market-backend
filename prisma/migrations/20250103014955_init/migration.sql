-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Owner', 'Manager', 'Cashier', 'Worker');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Salaried', 'Hourly');

-- CreateEnum
CREATE TYPE "PurchaseDebtStatus" AS ENUM ('unpaid', 'partially_paid', 'paid');

-- CreateEnum
CREATE TYPE "SalesDebtStatus" AS ENUM ('unpaid', 'partially_paid', 'paid');

-- CreateEnum
CREATE TYPE "PurchaseReturnStatus" AS ENUM ('pending', 'approved', 'completed', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "hourlyPay" DECIMAL(18,2),
    "monthlyPay" DECIMAL(18,2),
    "dateOfHire" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeTimeShift" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "startWorkTime" TIMESTAMP(3) NOT NULL,
    "endWorkTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeTimeShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeExpense" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "paymentMonth" TIMESTAMP(3) NOT NULL,
    "totalHours" DECIMAL(18,2),
    "hourlyPaid" DECIMAL(18,2),
    "totalPaid" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "EmployeeExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "unitName" TEXT NOT NULL,
    "unitSymbol" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "baseUnitId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductUnit" (
    "productId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,

    CONSTRAINT "ProductUnit_pkey" PRIMARY KEY ("productId","unitId")
);

-- CreateTable
CREATE TABLE "UnitConversion" (
    "id" SERIAL NOT NULL,
    "fromUnitId" INTEGER NOT NULL,
    "toUnitId" INTEGER NOT NULL,
    "conversionRate" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "UnitConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesInvoice" (
    "id" SERIAL NOT NULL,
    "workerId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "SalesInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesInvoiceItem" (
    "id" SERIAL NOT NULL,
    "productSellingPriceId" INTEGER NOT NULL,
    "salesInvoiceId" INTEGER NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "SalesInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSellingPrice" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "sellingPrice" DECIMAL(18,2) NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductSellingPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPurchasePrice" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "purchasePrice" DECIMAL(18,2) NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPurchasePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseInvoice" (
    "id" SERIAL NOT NULL,
    "workerId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseInvoiceItem" (
    "id" SERIAL NOT NULL,
    "productPurchasePriceId" INTEGER NOT NULL,
    "purchaseInvoiceId" INTEGER NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "PurchaseInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contactInfo" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "note" TEXT,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "note" TEXT,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseInvoicePayment" (
    "id" SERIAL NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "paidAmount" DECIMAL(18,2) NOT NULL,
    "purchaseInvoiceId" INTEGER NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseInvoicePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseDebt" (
    "id" SERIAL NOT NULL,
    "debtDate" TIMESTAMP(3) NOT NULL,
    "status" "PurchaseDebtStatus" NOT NULL DEFAULT 'unpaid',
    "originalAmount" DECIMAL(18,2) NOT NULL,
    "remainingAmount" DECIMAL(18,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "processedBy" INTEGER NOT NULL,
    "purchaseInvoiceId" INTEGER NOT NULL,
    "supplierId" INTEGER NOT NULL,

    CONSTRAINT "PurchaseDebt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseDebtPayment" (
    "id" SERIAL NOT NULL,
    "debtId" INTEGER NOT NULL,
    "purchaseInvoicePaymentId" INTEGER NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseDebtPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesInvoicePayment" (
    "id" SERIAL NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DECIMAL(18,2) NOT NULL,
    "paidAmount" DECIMAL(18,2) NOT NULL,
    "salesInvoiceId" INTEGER NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "SalesInvoicePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesDebt" (
    "id" SERIAL NOT NULL,
    "debtDate" TIMESTAMP(3) NOT NULL,
    "status" "SalesDebtStatus" NOT NULL DEFAULT 'unpaid',
    "originalAmount" DECIMAL(18,2) NOT NULL,
    "remainingAmount" DECIMAL(18,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "processedBy" INTEGER NOT NULL,
    "salesInvoiceId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "SalesDebt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesDebtPayment" (
    "id" SERIAL NOT NULL,
    "debtId" INTEGER NOT NULL,
    "salesInvoicePaymentId" INTEGER NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalesDebtPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissingProduct" (
    "id" SERIAL NOT NULL,
    "productSellingPriceId" INTEGER NOT NULL,
    "quantity" DECIMAL(18,2) NOT NULL,
    "processedBy" INTEGER,
    "notes" TEXT,
    "productId" INTEGER,

    CONSTRAINT "MissingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerReturn" (
    "id" SERIAL NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "quantity" DECIMAL(18,2) NOT NULL,
    "productSellingPriceId" INTEGER NOT NULL,
    "productId" INTEGER,
    "customerId" INTEGER,

    CONSTRAINT "CustomerReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerReturnPayment" (
    "id" SERIAL NOT NULL,
    "customerReturnId" INTEGER NOT NULL,
    "refundPrice" DECIMAL(18,2) NOT NULL,
    "refundAmount" DECIMAL(18,2) NOT NULL,
    "refundDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedBy" INTEGER,
    "notes" TEXT,

    CONSTRAINT "CustomerReturnPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseReturn" (
    "id" SERIAL NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplierId" INTEGER NOT NULL,
    "processedBy" INTEGER NOT NULL,
    "status" "PurchaseReturnStatus" NOT NULL DEFAULT 'pending',
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "refundAmount" DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    "notes" TEXT,
    "productPurchasePriceId" INTEGER NOT NULL,
    "reason" TEXT,
    "quantity" DECIMAL(18,2) NOT NULL,
    "productId" INTEGER,
    "purchaseInvoiceId" INTEGER,

    CONSTRAINT "PurchaseReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseReturnPayment" (
    "id" SERIAL NOT NULL,
    "purchaseReturnId" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(18,2) NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "userId" INTEGER,

    CONSTRAINT "PurchaseReturnPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE INDEX "EmployeeTimeShift_employeeId_idx" ON "EmployeeTimeShift"("employeeId");

-- CreateIndex
CREATE INDEX "EmployeeTimeShift_workDate_idx" ON "EmployeeTimeShift"("workDate");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_unitSymbol_key" ON "Unit"("unitSymbol");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_baseUnitId_idx" ON "Product"("baseUnitId");

-- CreateIndex
CREATE INDEX "ProductUnit_unitId_idx" ON "ProductUnit"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitConversion_fromUnitId_toUnitId_key" ON "UnitConversion"("fromUnitId", "toUnitId");

-- CreateIndex
CREATE INDEX "SalesInvoice_workerId_idx" ON "SalesInvoice"("workerId");

-- CreateIndex
CREATE INDEX "SalesInvoice_date_idx" ON "SalesInvoice"("date");

-- CreateIndex
CREATE INDEX "SalesInvoiceItem_salesInvoiceId_idx" ON "SalesInvoiceItem"("salesInvoiceId");

-- CreateIndex
CREATE INDEX "SalesInvoiceItem_productSellingPriceId_idx" ON "SalesInvoiceItem"("productSellingPriceId");

-- CreateIndex
CREATE INDEX "ProductSellingPrice_productId_idx" ON "ProductSellingPrice"("productId");

-- CreateIndex
CREATE INDEX "ProductSellingPrice_unitId_idx" ON "ProductSellingPrice"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSellingPrice_productId_unitId_effectiveDate_key" ON "ProductSellingPrice"("productId", "unitId", "effectiveDate");

-- CreateIndex
CREATE INDEX "ProductPurchasePrice_productId_idx" ON "ProductPurchasePrice"("productId");

-- CreateIndex
CREATE INDEX "ProductPurchasePrice_unitId_idx" ON "ProductPurchasePrice"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPurchasePrice_productId_unitId_effectiveDate_key" ON "ProductPurchasePrice"("productId", "unitId", "effectiveDate");

-- CreateIndex
CREATE INDEX "PurchaseInvoice_workerId_idx" ON "PurchaseInvoice"("workerId");

-- CreateIndex
CREATE INDEX "PurchaseInvoice_supplierId_idx" ON "PurchaseInvoice"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseInvoice_date_idx" ON "PurchaseInvoice"("date");

-- CreateIndex
CREATE INDEX "PurchaseInvoiceItem_purchaseInvoiceId_idx" ON "PurchaseInvoiceItem"("purchaseInvoiceId");

-- CreateIndex
CREATE INDEX "PurchaseInvoiceItem_productPurchasePriceId_idx" ON "PurchaseInvoiceItem"("productPurchasePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Customer_firstName_lastName_idx" ON "Customer"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "PurchaseInvoicePayment_purchaseInvoiceId_idx" ON "PurchaseInvoicePayment"("purchaseInvoiceId");

-- CreateIndex
CREATE INDEX "PurchaseInvoicePayment_paymentDate_idx" ON "PurchaseInvoicePayment"("paymentDate");

-- CreateIndex
CREATE INDEX "PurchaseInvoicePayment_processedBy_idx" ON "PurchaseInvoicePayment"("processedBy");

-- CreateIndex
CREATE INDEX "PurchaseDebt_purchaseInvoiceId_idx" ON "PurchaseDebt"("purchaseInvoiceId");

-- CreateIndex
CREATE INDEX "PurchaseDebt_status_idx" ON "PurchaseDebt"("status");

-- CreateIndex
CREATE INDEX "PurchaseDebt_processedBy_idx" ON "PurchaseDebt"("processedBy");

-- CreateIndex
CREATE INDEX "PurchaseDebt_supplierId_idx" ON "PurchaseDebt"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseDebtPayment_debtId_idx" ON "PurchaseDebtPayment"("debtId");

-- CreateIndex
CREATE INDEX "PurchaseDebtPayment_purchaseInvoicePaymentId_idx" ON "PurchaseDebtPayment"("purchaseInvoicePaymentId");

-- CreateIndex
CREATE INDEX "SalesInvoicePayment_salesInvoiceId_idx" ON "SalesInvoicePayment"("salesInvoiceId");

-- CreateIndex
CREATE INDEX "SalesInvoicePayment_paymentDate_idx" ON "SalesInvoicePayment"("paymentDate");

-- CreateIndex
CREATE INDEX "SalesInvoicePayment_processedBy_idx" ON "SalesInvoicePayment"("processedBy");

-- CreateIndex
CREATE INDEX "SalesDebt_salesInvoiceId_idx" ON "SalesDebt"("salesInvoiceId");

-- CreateIndex
CREATE INDEX "SalesDebt_status_idx" ON "SalesDebt"("status");

-- CreateIndex
CREATE INDEX "SalesDebt_processedBy_idx" ON "SalesDebt"("processedBy");

-- CreateIndex
CREATE INDEX "SalesDebt_customerId_idx" ON "SalesDebt"("customerId");

-- CreateIndex
CREATE INDEX "SalesDebtPayment_debtId_idx" ON "SalesDebtPayment"("debtId");

-- CreateIndex
CREATE INDEX "SalesDebtPayment_salesInvoicePaymentId_idx" ON "SalesDebtPayment"("salesInvoicePaymentId");

-- CreateIndex
CREATE INDEX "MissingProduct_processedBy_idx" ON "MissingProduct"("processedBy");

-- CreateIndex
CREATE INDEX "MissingProduct_productSellingPriceId_idx" ON "MissingProduct"("productSellingPriceId");

-- CreateIndex
CREATE INDEX "CustomerReturn_productSellingPriceId_idx" ON "CustomerReturn"("productSellingPriceId");

-- CreateIndex
CREATE INDEX "CustomerReturnPayment_customerReturnId_idx" ON "CustomerReturnPayment"("customerReturnId");

-- CreateIndex
CREATE INDEX "CustomerReturnPayment_processedBy_idx" ON "CustomerReturnPayment"("processedBy");

-- CreateIndex
CREATE INDEX "CustomerReturnPayment_refundDate_idx" ON "CustomerReturnPayment"("refundDate");

-- CreateIndex
CREATE INDEX "PurchaseReturn_supplierId_idx" ON "PurchaseReturn"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseReturn_processedBy_idx" ON "PurchaseReturn"("processedBy");

-- CreateIndex
CREATE INDEX "PurchaseReturn_status_idx" ON "PurchaseReturn"("status");

-- CreateIndex
CREATE INDEX "PurchaseReturn_returnDate_idx" ON "PurchaseReturn"("returnDate");

-- CreateIndex
CREATE INDEX "PurchaseReturnPayment_purchaseReturnId_idx" ON "PurchaseReturnPayment"("purchaseReturnId");

-- CreateIndex
CREATE INDEX "PurchaseReturnPayment_paymentDate_idx" ON "PurchaseReturnPayment"("paymentDate");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeTimeShift" ADD CONSTRAINT "EmployeeTimeShift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeExpense" ADD CONSTRAINT "EmployeeExpense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_baseUnitId_fkey" FOREIGN KEY ("baseUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductUnit" ADD CONSTRAINT "ProductUnit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductUnit" ADD CONSTRAINT "ProductUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitConversion" ADD CONSTRAINT "UnitConversion_fromUnitId_fkey" FOREIGN KEY ("fromUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitConversion" ADD CONSTRAINT "UnitConversion_toUnitId_fkey" FOREIGN KEY ("toUnitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoice" ADD CONSTRAINT "SalesInvoice_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoiceItem" ADD CONSTRAINT "SalesInvoiceItem_productSellingPriceId_fkey" FOREIGN KEY ("productSellingPriceId") REFERENCES "ProductSellingPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoiceItem" ADD CONSTRAINT "SalesInvoiceItem_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "SalesInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoiceItem" ADD CONSTRAINT "SalesInvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSellingPrice" ADD CONSTRAINT "ProductSellingPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSellingPrice" ADD CONSTRAINT "ProductSellingPrice_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPurchasePrice" ADD CONSTRAINT "ProductPurchasePrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPurchasePrice" ADD CONSTRAINT "ProductPurchasePrice_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoice" ADD CONSTRAINT "PurchaseInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoiceItem" ADD CONSTRAINT "PurchaseInvoiceItem_productPurchasePriceId_fkey" FOREIGN KEY ("productPurchasePriceId") REFERENCES "ProductPurchasePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoiceItem" ADD CONSTRAINT "PurchaseInvoiceItem_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoiceItem" ADD CONSTRAINT "PurchaseInvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoicePayment" ADD CONSTRAINT "PurchaseInvoicePayment_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoicePayment" ADD CONSTRAINT "PurchaseInvoicePayment_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseInvoicePayment" ADD CONSTRAINT "PurchaseInvoicePayment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDebt" ADD CONSTRAINT "PurchaseDebt_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDebt" ADD CONSTRAINT "PurchaseDebt_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDebt" ADD CONSTRAINT "PurchaseDebt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDebtPayment" ADD CONSTRAINT "PurchaseDebtPayment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "PurchaseDebt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDebtPayment" ADD CONSTRAINT "PurchaseDebtPayment_purchaseInvoicePaymentId_fkey" FOREIGN KEY ("purchaseInvoicePaymentId") REFERENCES "PurchaseInvoicePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoicePayment" ADD CONSTRAINT "SalesInvoicePayment_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "SalesInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoicePayment" ADD CONSTRAINT "SalesInvoicePayment_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInvoicePayment" ADD CONSTRAINT "SalesInvoicePayment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDebt" ADD CONSTRAINT "SalesDebt_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDebt" ADD CONSTRAINT "SalesDebt_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "SalesInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDebt" ADD CONSTRAINT "SalesDebt_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDebtPayment" ADD CONSTRAINT "SalesDebtPayment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "SalesDebt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDebtPayment" ADD CONSTRAINT "SalesDebtPayment_salesInvoicePaymentId_fkey" FOREIGN KEY ("salesInvoicePaymentId") REFERENCES "SalesInvoicePayment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingProduct" ADD CONSTRAINT "MissingProduct_productSellingPriceId_fkey" FOREIGN KEY ("productSellingPriceId") REFERENCES "ProductSellingPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingProduct" ADD CONSTRAINT "MissingProduct_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingProduct" ADD CONSTRAINT "MissingProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturn" ADD CONSTRAINT "CustomerReturn_productSellingPriceId_fkey" FOREIGN KEY ("productSellingPriceId") REFERENCES "ProductSellingPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturn" ADD CONSTRAINT "CustomerReturn_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturn" ADD CONSTRAINT "CustomerReturn_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturnPayment" ADD CONSTRAINT "CustomerReturnPayment_customerReturnId_fkey" FOREIGN KEY ("customerReturnId") REFERENCES "CustomerReturn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturnPayment" ADD CONSTRAINT "CustomerReturnPayment_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_productPurchasePriceId_fkey" FOREIGN KEY ("productPurchasePriceId") REFERENCES "ProductPurchasePrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturn" ADD CONSTRAINT "PurchaseReturn_purchaseInvoiceId_fkey" FOREIGN KEY ("purchaseInvoiceId") REFERENCES "PurchaseInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturnPayment" ADD CONSTRAINT "PurchaseReturnPayment_purchaseReturnId_fkey" FOREIGN KEY ("purchaseReturnId") REFERENCES "PurchaseReturn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseReturnPayment" ADD CONSTRAINT "PurchaseReturnPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
