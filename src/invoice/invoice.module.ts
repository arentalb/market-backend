import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductsModule } from '../products/products.module';
import { UnitsModule } from '../units/units.module';
import { PurchaseInvoiceController } from './purchase-invoice.controller';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { SaleInvoiceController } from './sale-invoice.controller';
import { SaleInvoiceService } from './sale-invoice.service';

@Module({
  controllers: [PurchaseInvoiceController, SaleInvoiceController],
  providers: [PurchaseInvoiceService, SaleInvoiceService],
  imports: [InventoryModule, ProductsModule, UnitsModule],
  exports: [PurchaseInvoiceService, SaleInvoiceService],
})
export class InvoiceModule {}
