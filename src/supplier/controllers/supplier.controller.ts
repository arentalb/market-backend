import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SupplierService } from '../services/supplier.service';
import { CreateSupplierDto } from '../dto/supplier/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/supplier/update-supplier.dto';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    const supplier = await this.supplierService.create(createSupplierDto);
    return {
      message: 'Supplier created successfully',
      data: { supplier },
    };
  }

  @Get()
  async findAll() {
    const suppliers = await this.supplierService.findAll();
    return {
      message: 'Suppliers retrieved successfully',
      data: { suppliers },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const supplier = await this.supplierService.findOne(id);
    return {
      message: 'Supplier retrieved successfully',
      data: { supplier },
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    const supplier = await this.supplierService.update(id, updateSupplierDto);
    return {
      message: 'Supplier updated successfully',
      data: { supplier },
    };
  }
}
