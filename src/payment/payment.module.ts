import { Module } from '@nestjs/common';
import { SaleInvoicePaymentController } from './sale-invoice-payment.controller';
import { PurchaseInvoicePaymentController } from './purchase-invoice-payment.controller';
import { SaleInvoicePaymentService } from './sale-invoice-payment.service';
import { PurchaseInvoicePaymentService } from './purchase-invoice-payment.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SaleInvoicePaymentController, PurchaseInvoicePaymentController],
  providers: [SaleInvoicePaymentService, PurchaseInvoicePaymentService],
  imports: [PrismaModule],
})
export class PaymentModule {}
