import { IsNumber } from 'class-validator';

export class CreateSaleInvoicePaymentDto {
  @IsNumber()
  invoiceId: number;
  @IsNumber()
  amount: number;
}
