import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  unitId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreatePurchaseInvoiceDto {
  @IsNumber()
  supplierId: number;

  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
