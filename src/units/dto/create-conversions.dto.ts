import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConversionsDto {
  @IsNumber()
  @IsNotEmpty()
  fromUnitId: number;

  @IsNumber()
  @IsNotEmpty()
  toUnitId: number;

  @IsNumber()
  @IsNotEmpty()
  conversionRate: number;
}
