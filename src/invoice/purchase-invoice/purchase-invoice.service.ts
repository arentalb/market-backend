// purchase-invoice/purchase-invoice.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { InventoryService } from 'src/inventory/inventory.service';
import { ProductPriceService } from 'src/product-price/product-price.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { InvoiceData } from './interfaces/invoice-data';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { UnitConversionService } from '../../units/unit-conversion.service';

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
          workerId: userId,
          date: new Date(),
        },
      });

      await this.productPriceService.bulkUpsertPrices(
        prismaTransaction,
        products,
      );

      for (const product of products) {
        const latestPrice = await this.productPriceService.findLatestPrice(
          prismaTransaction,
          product.productId,
          product.unitId,
        );

        const baseUnitQuantity =
          await this.unitConversionService.calculateQuantityInBaseUnitByProductId(
            product.productId,
            product.unitId,
            product.quantity,
            prismaTransaction,
          );

        await prismaTransaction.purchaseInvoiceItem.create({
          data: {
            purchaseInvoiceId: invoice.id,
            productPurchasePriceId: latestPrice.id,
            quantity: product.quantity,
          },
        });

        await this.inventoryService.increaseInventory(
          prismaTransaction,
          product.productId,
          baseUnitQuantity,
        );
      }

      return invoice;
    });
  }

  async findAll(): Promise<InvoiceData[]> {
    const invoices = await this.prismaService.purchaseInvoice.findMany({
      include: {
        supplier: {
          select: { name: true },
        },
        worker: {
          select: { name: true },
        },
        items: {
          include: {
            productPurchasePrice: {
              include: {
                product: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    return invoices.map((invoice) => {
      const products = invoice.items.map((item) => ({
        productName: item.productPurchasePrice.product.name,
        quantity: item.quantity.toNumber(),
        price: item.productPurchasePrice.purchasePrice.toNumber(),
        unitSymbol: item.productPurchasePrice.unit.unitSymbol,
      }));

      return {
        invoiceId: invoice.id,
        supplierName: invoice.supplier.name,
        workerName: invoice.worker.name,
        products,
      };
    });
  }

  async findOne(id: number): Promise<InvoiceData> {
    const invoice = await this.prismaService.purchaseInvoice.findUnique({
      where: { id },
      include: {
        supplier: { select: { name: true } },
        worker: { select: { name: true } },
        items: {
          include: {
            productPurchasePrice: {
              include: {
                product: true,
                unit: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    const products = invoice.items.map((item) => ({
      productName: item.productPurchasePrice.product.name,
      quantity: item.quantity.toNumber(),
      price: item.productPurchasePrice.purchasePrice.toNumber(),
      unitSymbol: item.productPurchasePrice.unit.unitSymbol,
    }));

    return {
      invoiceId: invoice.id,
      supplierName: invoice.supplier.name,
      workerName: invoice.worker.name,
      products,
    };
  }

  async update(id: number, updateDto: UpdatePurchaseInvoiceDto) {
    const { supplierId, products } = updateDto;

    return this.prismaService.$transaction(async (prismaTransaction) => {
      const existing = await prismaTransaction.purchaseInvoice.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Invoice with id ${id} not found`);
      }

      const invoice = await prismaTransaction.purchaseInvoice.update({
        where: { id },
        data: {
          supplierId,
          date: new Date(),
        },
      });

      await prismaTransaction.purchaseInvoiceItem.deleteMany({
        where: { purchaseInvoiceId: id },
      });

      await this.productPriceService.bulkUpsertPrices(
        prismaTransaction,
        products,
      );

      for (const product of products) {
        const latestPrice = await this.productPriceService.findLatestPrice(
          prismaTransaction,
          product.productId,
          product.unitId,
        );

        const baseUnitQuantity =
          await this.unitConversionService.calculateQuantityInBaseUnitByProductId(
            product.productId,
            product.unitId,
            product.quantity,
            prismaTransaction,
          );

        await prismaTransaction.purchaseInvoiceItem.create({
          data: {
            purchaseInvoiceId: invoice.id,
            productPurchasePriceId: latestPrice.id,
            quantity: product.quantity,
          },
        });

        await this.inventoryService.increaseInventory(
          prismaTransaction,
          product.productId,
          baseUnitQuantity,
        );
      }

      return invoice;
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

      return { message: `Invoice with id ${id} removed successfully` };
    });
  }
}
