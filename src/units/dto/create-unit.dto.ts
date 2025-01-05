import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  unitName: string;

  @IsString()
  @IsNotEmpty()
  unitSymbol: string;
}
