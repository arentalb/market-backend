import { IsOptional, IsString } from 'class-validator';

export class CreateSupplierWorkerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
