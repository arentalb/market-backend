import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductsModule } from '../products/products.module';
import { UnitsModule } from '../units/units.module';
import { PurchaseInvoiceController } from './purchase-invoice.controller';
import { PurchaseInvoiceService } from './purchase-invoice.service';

@Module({
  controllers: [PurchaseInvoiceController],
  providers: [PurchaseInvoiceService],
  imports: [InventoryModule, ProductsModule, UnitsModule],
  exports: [PurchaseInvoiceService],
})
export class InvoiceModule {}
