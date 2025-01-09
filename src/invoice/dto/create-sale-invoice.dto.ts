import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  unitId: number;

  @IsNumber()
  quantity: number;
}

export class CreateSaleInvoiceDto {
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
