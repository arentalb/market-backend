import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductSalePriceDto {
  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;
  @IsNumber()
  @IsNotEmpty()
  unitId: number;
}
