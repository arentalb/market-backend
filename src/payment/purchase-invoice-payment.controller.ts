import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PurchaseInvoicePaymentService } from './purchase-invoice-payment.service';
import { CreatePurchaseInvoicePaymentDto } from './dto/create-purchase-invoice-payment.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('purchase-invoice-payment')
export class PurchaseInvoicePaymentController {
  constructor(
    private readonly purchaseInvoicePaymentService: PurchaseInvoicePaymentService,
  ) {}

  @Post()
  async create(
    @Body() createPurchaseInvoicePaymentDto: CreatePurchaseInvoicePaymentDto,
    @ActiveUser('id') userId: number,
  ) {
    const invoicePayment = await this.purchaseInvoicePaymentService.create(
      createPurchaseInvoicePaymentDto,
      userId,
    );
    return {
      message: 'Invoice payment created successfully',
      data: { invoicePayment },
    };
  }

  @Get()
  async findAll() {
    const invoicePayment = await this.purchaseInvoicePaymentService.findAll();
    return {
      message: 'Invoice payment fetched successfully',
      data: { invoicePayment },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const invoicePayment = await this.purchaseInvoicePaymentService.findOne(id);
    return {
      message: 'Invoice payment fetched successfully',
      data: { invoicePayment },
    };
  }
}
