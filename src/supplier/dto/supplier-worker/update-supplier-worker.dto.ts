import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierWorkerDto } from './create-supplier-worker.dto';

export class UpdateSupplierWorkerDto extends PartialType(
  CreateSupplierWorkerDto,
) {}
