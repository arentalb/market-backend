import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSupplierWorkerDto } from '../supplier-worker/create-supplier-worker.dto';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierWorkerDto)
  workers?: CreateSupplierWorkerDto[];
}
