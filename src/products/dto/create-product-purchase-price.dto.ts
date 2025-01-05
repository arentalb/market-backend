import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductPurchasePriceDto {
  @IsNumber()
  @IsNotEmpty()
  purchasePrice: number;
  @IsNumber()
  @IsNotEmpty()
  unitId: number;
}
