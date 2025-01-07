import { Module } from '@nestjs/common';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { PurchaseInvoiceController } from './purchase-invoice.controller';

@Module({
  controllers: [PurchaseInvoiceController],
  providers: [PurchaseInvoiceService],
})
export class PurchaseInvoiceModule {}
