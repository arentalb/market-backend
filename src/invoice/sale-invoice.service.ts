import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';
import { ProductPriceService } from '../products/product-price.service';
import { UnitConversionService } from '../units/unit-conversion.service';
import { SaleInvoiceData } from './interfaces/invoice-data';

@Injectable()
export class SaleInvoiceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly inventoryService: InventoryService,
    private readonly productPriceService: ProductPriceService,
    private readonly unitConversionService: UnitConversionService,
  ) {}

  async create(createDto: CreateSaleInvoiceDto, workerId: number) {
    const { products } = createDto;

    return this.prismaService.$transaction(async (prismaTransaction) => {
      const invoice = await prismaTransaction.salesInvoice.create({
        data: {
          workerId: workerId,
          totalAmount: 0,
          date: new Date(),
        },
      });

      let totalAmount = 0;

      for (const product of products) {
        const salePriceInDb =
          await this.productPriceService.getProductFromSellingPrice(
            product.productId,
            product.unitId,
            prismaTransaction,
          );

        await prismaTransaction.salesInvoiceItem.create({
          data: {
            salesInvoiceId: invoice.id,
            productSellingPriceId: salePriceInDb.id,
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

        await this.inventoryService.decreaseInventory(
          product.productId,
          baseUnitQuantity,
          prismaTransaction,
        );
        totalAmount += salePriceInDb.sellingPrice.toNumber() * product.quantity;
      }

      await prismaTransaction.salesInvoice.update({
        where: { id: invoice.id },
        data: { totalAmount },
      });
      return invoice;
    });
  }

  async findAll(): Promise<SaleInvoiceData[]> {
    const invoices = await this.prismaService.salesInvoice.findMany({
      include: {
        worker: {
          select: { name: true },
        },
        salesInvoiceItems: {
          include: {
            productSellingPrice: {
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
      const products = invoice.salesInvoiceItems.map((item) => ({
        productName: item.productSellingPrice.product.name,
        quantity: item.quantity.toNumber(),
        price: item.productSellingPrice.sellingPrice.toNumber(),
        unitSymbol: item.productSellingPrice.unit.unitSymbol,
      }));

      return {
        invoiceId: invoice.id,
        workerName: invoice.worker.name,
        products,
      };
    });
  }

  async findOne(id: number): Promise<SaleInvoiceData> {
    const invoice = await this.prismaService.salesInvoice.findUnique({
      where: { id },
      include: {
        worker: { select: { name: true } },
        salesInvoiceItems: {
          include: {
            productSellingPrice: {
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

    const products = invoice.salesInvoiceItems.map((item) => ({
      productName: item.productSellingPrice.product.name,
      quantity: item.quantity.toNumber(),
      price: item.productSellingPrice.sellingPrice.toNumber(),
      unitSymbol: item.productSellingPrice.unit.unitSymbol,
    }));

    return {
      invoiceId: invoice.id,
      workerName: invoice.worker.name,
      products,
    };
  }

  async update(invoiceId: number, updateDto: UpdateSaleInvoiceDto) {
    const { products } = updateDto;

    return this.prismaService.$transaction(async (prismaTransaction) => {
      const invoice = await prismaTransaction.salesInvoice.findUnique({
        where: { id: invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with id ${invoiceId} not found`);
      }

      await prismaTransaction.salesInvoice.update({
        where: { id: invoiceId },
        data: {
          date: new Date(),
        },
      });

      const existingItems = await prismaTransaction.salesInvoiceItem.findMany({
        where: { salesInvoiceId: invoiceId },
        include: {
          productSellingPrice: true,
        },
      });

      for (const item of existingItems) {
        const baseUnitQuantity =
          await this.unitConversionService.calculateQuantityInBaseUnitByProductId(
            item.productSellingPrice.productId,
            item.productSellingPrice.unitId,
            item.quantity.toNumber(),
            prismaTransaction,
          );

        await this.inventoryService.increaseInventory(
          item.productSellingPrice.productId,
          baseUnitQuantity,
          prismaTransaction,
        );

        await prismaTransaction.salesInvoiceItem.delete({
          where: { id: item.id },
        });
      }

      const totals = new Map<number, number>();
      let totalAmount = 0;

      for (const product of products) {
        const salePriceInDb =
          await this.productPriceService.getProductFromSellingPrice(
            product.productId,
            product.unitId,
            prismaTransaction,
          );

        await prismaTransaction.salesInvoiceItem.create({
          data: {
            salesInvoiceId: invoice.id,
            productSellingPriceId: salePriceInDb.id,
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

        await this.inventoryService.decreaseInventory(
          product.productId,
          baseUnitQuantity,
          prismaTransaction,
        );

        totals.set(
          product.productId,
          salePriceInDb.sellingPrice.toNumber() * product.quantity,
        );
      }

      totals.forEach((item) => {
        totalAmount += item;
      });

      await prismaTransaction.salesInvoice.update({
        where: { id: invoice.id },
        data: { totalAmount },
      });

      return invoiceId;
    });
  }
  async remove(id: number) {
    return this.prismaService.$transaction(async (prismaClient) => {
      const existing = await prismaClient.salesInvoice.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Invoice with id ${id} not found`);
      }

      await prismaClient.salesInvoiceItem.deleteMany({
        where: { salesInvoiceId: id },
      });

      await prismaClient.salesInvoice.delete({
        where: { id },
      });

      return id;
    });
  }
}
