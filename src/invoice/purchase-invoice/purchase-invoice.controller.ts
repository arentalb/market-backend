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
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { ActiveUser } from '../../auth/decorators/active-user.decorator';

@Controller('purchase-invoice')
export class PurchaseInvoiceController {
  constructor(
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
  ) {}

  @Post()
  async create(
    @Body() createPurchaseInvoiceDto: CreatePurchaseInvoiceDto,
    @ActiveUser('id') userId: number,
  ) {
    const invoice = await this.purchaseInvoiceService.create(
      createPurchaseInvoiceDto,
      userId,
    );
    return {
      message: 'Invoice created successfully',
      data: { invoice },
    };
  }

  @Get()
  async findAll() {
    const invoices = await this.purchaseInvoiceService.findAll();
    return {
      message: 'Invoice detail of all invoices',
      data: {
        invoices,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const invoice = await this.purchaseInvoiceService.findOne(id);
    return {
      message: 'Invoice detail with id of ' + id,
      data: {
        invoice,
      },
    };
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
  ) {
    return this.purchaseInvoiceService.update(+id, updatePurchaseInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseInvoiceService.remove(+id);
  }
}
