import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { InventoryService } from 'src/inventory/inventory.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { ProductPriceService } from '../products/services/product-price.service';
import { UnitConversionService } from '../units/unit-conversion.service';

@Injectable()
export class PurchaseInvoiceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly productPriceService: ProductPriceService,
    private readonly unitConversionService: UnitConversionService,
  ) {}

  async create(createDto: CreatePurchaseInvoiceDto, userId: number) {
    const { supplierId, products } = createDto;

    return this.prismaService.$transaction(async (prismaTransaction) => {
      const invoice = await prismaTransaction.purchaseInvoice.create({
        data: {
          supplierId,
          processedBy: userId,
        },
      });

      let totalAmount = 0;
      for (const product of products) {
        const purchasePrice =
          await this.productPriceService.createPurchasePrice(
            product.productId,
            product.unitId,
            product.price,
            prismaTransaction,
          );

        await prismaTransaction.purchaseInvoiceItem.create({
          data: {
            purchaseInvoiceId: invoice.id,
            productPurchasePriceId: purchasePrice.id,
            quantity: product.quantity,
          },
        });

        const baseUnitQuantity =
          await this.unitConversionService.calculateQuantityInBaseUnitByProductId(
            product.productId,
            product.unitId,
            product.quantity,
            prismaTransaction,
          );

        await this.inventoryService.increaseInventory(
          product.productId,
          baseUnitQuantity,
          prismaTransaction,
        );

        totalAmount += purchasePrice.price.toNumber() * product.quantity;
      }

      await prismaTransaction.purchaseInvoice.update({
        where: { id: invoice.id },
        data: { totalAmount },
      });
      return invoice;
    });
  }

  async findAll() {
    const invoices = await this.prismaService.purchaseInvoice.findMany({
      include: {
        supplier: {
          select: { name: true },
        },
        user: {
          select: { name: true },
        },
      },
    });

    return invoices.map((invoice) => {
      return {
        id: invoice.id,
        supplierName: invoice.supplier.name,
        workerName: invoice.user.name,
        totalAmount: invoice.totalAmount,
        paidSoFar: invoice.paidSoFar,
        status: invoice.status,
      };
    });
  }

  async findOne(id: number) {
    const invoice = await this.prismaService.purchaseInvoice.findUnique({
      where: { id },
      include: {
        supplier: { select: { name: true } },
        user: { select: { name: true } },
        purchaseInvoiceItems: {
          include: {
            productPurchasePrice: {
              include: {
                product: true,
                unit: true,
              },
            },
          },
        },
        purchasePayments: {
          include: {
            user: {
              select: {
                name: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    const products = invoice.purchaseInvoiceItems.map((item) => ({
      id: item.productPurchasePrice.product.id,
      productName: item.productPurchasePrice.product.name,
      quantity: item.quantity.toNumber(),
      price: item.productPurchasePrice.price.toNumber(),
      unitSymbol: item.productPurchasePrice.unit.unitSymbol,
    }));

    const payments = invoice.purchasePayments.map((payment) => {
      return {
        id: payment.id,
        amount: payment.amount,
        workerName: payment.user.name,
        paidAt: payment.user.createdAt,
      };
    });
    return {
      id: invoice.id,
      supplierName: invoice.supplier.name,
      workerName: invoice.user.name,
      totalAmount: invoice.totalAmount,
      paidSoFar: invoice.paidSoFar,
      status: invoice.status,
      products,
      payments,
    };
  }

  async update(invoiceId: number, updateDto: UpdatePurchaseInvoiceDto) {
    const { supplierId, products } = updateDto;

    return this.prismaService.$transaction(async (prismaTransaction) => {
      const invoice = await prismaTransaction.purchaseInvoice.findUnique({
        where: { id: invoiceId },
        include: {
          purchaseInvoiceItems: {
            include: {
              productPurchasePrice: true,
            },
          },
        },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with id ${invoiceId} not found`);
      }

      await prismaTransaction.purchaseInvoice.update({
        where: { id: invoiceId },
        data: {
          supplierId,
        },
      });

      for (const item of invoice.purchaseInvoiceItems) {
        const baseUnitQuantity =
          await this.unitConversionService.calculateQuantityInBaseUnitByProductId(
            item.productPurchasePrice.productId,
            item.productPurchasePrice.unitId,
            item.quantity.toNumber(),
            prismaTransaction,
          );

        await this.inventoryService.decreaseInventory(
          item.productPurchasePrice.productId,
          baseUnitQuantity,
          prismaTransaction,
        );

        await prismaTransaction.purchaseInvoiceItem.delete({
          where: { id: item.id },
        });

        await prismaTransaction.productPurchasePrice.delete({
          where: { id: item.productPurchasePriceId },
        });
      }

      let totalAmount = 0;
      for (const product of products) {
        const purchasePrice =
          await this.productPriceService.createPurchasePrice(
            product.productId,
            product.unitId,
            product.price,
            prismaTransaction,
          );

        await prismaTransaction.purchaseInvoiceItem.create({
          data: {
            purchaseInvoiceId: invoice.id,
            productPurchasePriceId: purchasePrice.id,
            quantity: product.quantity,
          },
        });

        const baseUnitQuantity =
          await this.unitConversionService.calculateQuantityInBaseUnitByProductId(
            product.productId,
            product.unitId,
            product.quantity,
            prismaTransaction,
          );

        await this.inventoryService.increaseInventory(
          product.productId,
          baseUnitQuantity,
          prismaTransaction,
        );
        totalAmount += purchasePrice.price.toNumber() * product.quantity;
      }
      await prismaTransaction.purchaseInvoice.update({
        where: { id: invoice.id },
        data: { totalAmount },
      });
      return invoiceId;
    });
  }

  async remove(id: number) {
    return this.prismaService.$transaction(async (prismaClient) => {
      const existing = await prismaClient.purchaseInvoice.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Invoice with id ${id} not found`);
      }

      await prismaClient.purchaseInvoiceItem.deleteMany({
        where: { purchaseInvoiceId: id },
      });

      await prismaClient.purchaseInvoice.delete({
        where: { id },
      });

      return id;
    });
  }
}
