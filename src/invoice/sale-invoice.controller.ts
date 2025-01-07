import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SaleInvoiceService } from './sale-invoice.service';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';

@Controller('sale-invoice')
export class SaleInvoiceController {
  constructor(private readonly saleInvoiceService: SaleInvoiceService) {}

  @Post()
  create(@Body() createSaleInvoiceDto: CreateSaleInvoiceDto) {
    return this.saleInvoiceService.create(createSaleInvoiceDto);
  }

  @Get()
  findAll() {
    return this.saleInvoiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleInvoiceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleInvoiceDto: UpdateSaleInvoiceDto,
  ) {
    return this.saleInvoiceService.update(+id, updateSaleInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleInvoiceService.remove(+id);
  }
}
