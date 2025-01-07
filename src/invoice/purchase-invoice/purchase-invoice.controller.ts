import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  findAll() {
    return this.purchaseInvoiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseInvoiceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
  ) {
    return this.purchaseInvoiceService.update(+id, updatePurchaseInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseInvoiceService.remove(+id);
  }
}
