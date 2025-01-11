import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleInvoicePaymentDto } from './dto/create-sale-invoice-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class SaleInvoicePaymentService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createSaleInvoicePaymentDto: CreateSaleInvoicePaymentDto,
    userId: number,
  ) {
    const { invoiceId, amount } = createSaleInvoicePaymentDto;

    const invoice = await this.prismaService.saleInvoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        salePayments: true,
      },
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const newPaidSoFar = invoice.paidSoFar.toNumber() + amount;
    if (newPaidSoFar > invoice.totalAmount.toNumber()) {
      throw new NotFoundException('You can not pay more that the total ');
    }
    const newInvoiceStatus =
      newPaidSoFar === invoice.totalAmount.toNumber()
        ? InvoiceStatus.PAID
        : InvoiceStatus.PARTIALLY_PAID;
    const updatedInvoice = await this.prismaService.saleInvoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        paidSoFar: newPaidSoFar,
        status: newInvoiceStatus,
      },
    });
    await this.prismaService.salePayment.create({
      data: {
        saleInvoiceId: invoice.id,
        amount: amount,
        processedBy: userId,
      },
    });
    return updatedInvoice;
  }
  async findAll() {
    return this.prismaService.salePayment.findMany({
      include: {
        saleInvoice: true,
      },
    });
  }

  async findOne(id: number) {
    const salePayment = await this.prismaService.salePayment.findUnique({
      where: { id },
      include: {
        saleInvoice: true,
      },
    });
    if (!salePayment) {
      throw new NotFoundException(`Sale payment with ID ${id} not found`);
    }
    return salePayment;
  }
}
