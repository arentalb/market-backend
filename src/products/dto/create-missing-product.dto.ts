import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMissingProductDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  unitId: number;
  @IsNumber()
  quantity: number;
  @IsString()
  @IsNotEmpty()
  note: string;
}
