import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseInvoicePaymentDto } from './dto/create-purchase-invoice-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class PurchaseInvoicePaymentService {
  constructor(private prismaService: PrismaService) {}

  async create(
    createPurchaseInvoicePaymentDto: CreatePurchaseInvoicePaymentDto,
    userId: number,
  ) {
    const { invoiceId, amount } = createPurchaseInvoicePaymentDto;

    const invoice = await this.prismaService.purchaseInvoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        purchasePayments: true,
        supplier: true,
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
    const updatedInvoice = await this.prismaService.purchaseInvoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        paidSoFar: newPaidSoFar,
        status: newInvoiceStatus,
      },
    });
    await this.prismaService.purchasePayment.create({
      data: {
        purchaseInvoiceId: invoice.id,
        amount: amount,
        processedBy: userId,
      },
    });
    return updatedInvoice;
  }

  async findAll() {
    return this.prismaService.purchasePayment.findMany({
      include: {
        purchaseInvoice: true,
      },
    });
  }

  async findOne(id: number) {
    const salePayment = await this.prismaService.purchasePayment.findUnique({
      where: { id },
      include: {
        purchaseInvoice: true,
      },
    });
    if (!salePayment) {
      throw new NotFoundException(`Sale payment with ID ${id} not found`);
    }
    return salePayment;
  }
}
