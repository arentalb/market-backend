import { Module } from '@nestjs/common';
import { SupplierService } from './services/supplier.service';
import { SupplierController } from './controllers/supplier.controller';
import { SupplierWorkerController } from './controllers/supplier-worker.controller';
import { SupplierWorkerService } from './services/supplier-worker.service';

@Module({
  controllers: [SupplierController, SupplierWorkerController],
  providers: [SupplierService, SupplierWorkerService],
})
export class SupplierModule {}
