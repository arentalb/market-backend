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
import { SaleInvoiceService } from './sale-invoice.service';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('sale-invoice')
export class SaleInvoiceController {
  constructor(private readonly saleInvoiceService: SaleInvoiceService) {}

  @Post()
  async create(
    @Body() createSaleInvoiceDto: CreateSaleInvoiceDto,
    @ActiveUser('id') userId: number,
  ) {
    const invoice = await this.saleInvoiceService.create(
      createSaleInvoiceDto,
      userId,
    );
    return {
      message: 'Invoice created successfully',
      data: { invoice },
    };
  }

  @Get()
  async findAll() {
    const invoices = await this.saleInvoiceService.findAll();
    return {
      message: 'Invoice detail of all invoices',
      data: {
        invoices,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const invoice = await this.saleInvoiceService.findOne(id);
    return {
      message: 'Invoice detail with id of ' + id,
      data: {
        invoice,
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSaleInvoiceDto: UpdateSaleInvoiceDto,
  ) {
    const invoice = await this.saleInvoiceService.update(
      id,
      updateSaleInvoiceDto,
    );
    return {
      message: 'Invoice updated ',
      data: {
        invoice,
      },
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const invoice = await this.saleInvoiceService.remove(id);
    return {
      message: 'Invoice deleted ',
      data: {
        invoice,
      },
    };
  }
}
