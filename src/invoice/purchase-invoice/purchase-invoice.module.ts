import { Module } from '@nestjs/common';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { PurchaseInvoiceController } from './purchase-invoice.controller';
import { InventoryModule } from '../../inventory/inventory.module';
import { UnitsModule } from '../../units/units.module';
import { ProductsModule } from '../../products/products.module';

@Module({
  controllers: [PurchaseInvoiceController],
  providers: [PurchaseInvoiceService],
  imports: [InventoryModule, ProductsModule, UnitsModule],
  exports: [PurchaseInvoiceService],
})
export class PurchaseInvoiceModule {}
