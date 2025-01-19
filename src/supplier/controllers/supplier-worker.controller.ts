import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SupplierWorkerService } from '../services/supplier-worker.service';
import { CreateSupplierWorkerDto } from '../dto/supplier-worker/create-supplier-worker.dto';
import { UpdateSupplierWorkerDto } from '../dto/supplier-worker/update-supplier-worker.dto';

@Controller('suppliers/:supplierId/workers')
export class SupplierWorkerController {
  constructor(private readonly supplierWorkerService: SupplierWorkerService) {}

  @Post()
  async create(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Body() createSupplierWorkerDto: CreateSupplierWorkerDto,
  ) {
    const worker = await this.supplierWorkerService.create(
      supplierId,
      createSupplierWorkerDto,
    );
    return {
      message: 'Worker added to supplier successfully',
      data: { worker },
    };
  }

  @Get()
  async findAll(@Param('supplierId', ParseIntPipe) supplierId: number) {
    const workers = await this.supplierWorkerService.findAll(supplierId);
    return {
      message: 'Workers retrieved successfully',
      data: { workers },
    };
  }

  @Get(':id')
  async findOne(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const worker = await this.supplierWorkerService.findOne(supplierId, id);
    return {
      message: 'Worker retrieved successfully',
      data: { worker },
    };
  }

  @Patch(':id')
  async update(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierWorkerDto: UpdateSupplierWorkerDto,
  ) {
    const worker = await this.supplierWorkerService.update(
      supplierId,
      id,
      updateSupplierWorkerDto,
    );
    return {
      message: 'Worker updated successfully',
      data: { worker },
    };
  }

  @Delete(':id')
  async remove(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.supplierWorkerService.remove(supplierId, id);
    return {
      message: 'Worker removed successfully',
      data: {},
    };
  }
}
