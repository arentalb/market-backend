import { Module } from '@nestjs/common';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { PurchaseInvoiceController } from './purchase-invoice.controller';
import { ProductPriceModule } from '../../product-price/product-price.module';
import { InventoryModule } from '../../inventory/inventory.module';
import { UnitsModule } from '../../units/units.module';

@Module({
  controllers: [PurchaseInvoiceController],
  providers: [PurchaseInvoiceService],
  imports: [InventoryModule, ProductPriceModule, UnitsModule],
  exports: [PurchaseInvoiceService],
})
export class PurchaseInvoiceModule {}
