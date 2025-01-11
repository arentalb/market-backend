import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SaleInvoicePaymentService } from './sale-invoice-payment.service';
import { CreateSaleInvoicePaymentDto } from './dto/create-sale-invoice-payment.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('sale-invoice-payment')
export class SaleInvoicePaymentController {
  constructor(
    private readonly saleInvoicePaymentService: SaleInvoicePaymentService,
  ) {}

  @Post()
  create(
    @Body() createSaleInvoicePaymentDto: CreateSaleInvoicePaymentDto,
    @ActiveUser('id') userId: number,
  ) {
    return this.saleInvoicePaymentService.create(
      createSaleInvoicePaymentDto,
      userId,
    );
  }

  @Get()
  async findAll() {
    const invoicePayment = await this.saleInvoicePaymentService.findAll();
    return {
      message: 'Invoice payment fetched successfully',
      data: { invoicePayment },
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const invoicePayment = await this.saleInvoicePaymentService.findOne(id);
    return {
      message: 'Invoice payment fetched successfully',
      data: { invoicePayment },
    };
  }
}
