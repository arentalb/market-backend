import { IsNumber } from 'class-validator';

export class CreatePurchaseInvoicePaymentDto {
  @IsNumber()
  invoiceId: number;
  @IsNumber()
  amount: number;
}
