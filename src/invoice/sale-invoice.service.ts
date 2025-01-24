import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { CreateSaleInvoiceDto } from './dto/create-sale-invoice.dto';
import { UpdateSaleInvoiceDto } from './dto/update-sale-invoice.dto';
import { ProductPriceService } from '../products/services/product-price.service';
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
    const { products, customerId, paidAmount } = createDto;

    return this.prismaService.$transaction(async (prismaTransaction) => {
      const invoice = await prismaTransaction.saleInvoice.create({
        data: {
          processedBy: workerId,
          totalAmount: 0,
          customerId: customerId,
          paidSoFar: paidAmount || 0,
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
        if (!salePriceInDb) {
          throw new NotFoundException(
            `Product price not found for product ${product.productId}`,
          );
        }

        await prismaTransaction.saleInvoiceItem.create({
          data: {
            saleInvoiceId: invoice.id,
            productSalePriceId: salePriceInDb.id,
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
        totalAmount += salePriceInDb.price.toNumber() * product.quantity;
      }

      return prismaTransaction.saleInvoice.update({
        where: { id: invoice.id },
        data: { totalAmount, paidSoFar: paidAmount || totalAmount },
      });
    });
  }
  async findAll(): Promise<SaleInvoiceData[]> {
    const invoices = await this.prismaService.saleInvoice.findMany({
      include: {
        user: {
          select: { name: true },
        },
        saleInvoiceItems: {
          include: {
            productSalePrice: {
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
      const products = invoice.saleInvoiceItems.map((item) => ({
        productName: item.productSalePrice.product.name,
        quantity: item.quantity.toNumber(),
        price: item.productSalePrice.price.toNumber(),
        unitSymbol: item.productSalePrice.unit.unitSymbol,
      }));

      return {
        invoiceId: invoice.id,
        workerName: invoice.user.name,
        products,
      };
    });
  }

  async findOne(id: number): Promise<SaleInvoiceData> {
    const invoice = await this.prismaService.saleInvoice.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        saleInvoiceItems: {
          include: {
            productSalePrice: {
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

    const products = invoice.saleInvoiceItems.map((item) => ({
      productName: item.productSalePrice.product.name,
      quantity: item.quantity.toNumber(),
      price: item.productSalePrice.price.toNumber(),
      unitSymbol: item.productSalePrice.unit.unitSymbol,
    }));

    return {
      invoiceId: invoice.id,
      workerName: invoice.user.name,
      products,
    };
  }

  async update(invoiceId: number, updateDto: UpdateSaleInvoiceDto) {
    const { products } = updateDto;

    return this.prismaService.$transaction(async (prismaTransaction) => {
      const invoice = await prismaTransaction.saleInvoice.findUnique({
        where: { id: invoiceId },
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice with id ${invoiceId} not found`);
      }

      await prismaTransaction.saleInvoice.update({
        where: { id: invoiceId },
        data: {},
      });

      const existingItems = await prismaTransaction.saleInvoiceItem.findMany({
        where: { saleInvoiceId: invoiceId },
        include: {
          productSalePrice: true,
        },
      });

      for (const item of existingItems) {
        const baseUnitQuantity =
          await this.unitConversionService.calculateQuantityInBaseUnitByProductId(
            item.productSalePrice.productId,
            item.productSalePrice.unitId,
            item.quantity.toNumber(),
            prismaTransaction,
          );

        await this.inventoryService.increaseInventory(
          item.productSalePrice.productId,
          baseUnitQuantity,
          prismaTransaction,
        );

        await prismaTransaction.saleInvoiceItem.delete({
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

        await prismaTransaction.saleInvoiceItem.create({
          data: {
            saleInvoiceId: invoice.id,
            productSalePriceId: salePriceInDb.id,
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
          salePriceInDb.price.toNumber() * product.quantity,
        );
      }

      totals.forEach((item) => {
        totalAmount += item;
      });

      await prismaTransaction.saleInvoice.update({
        where: { id: invoice.id },
        data: { totalAmount },
      });

      return invoiceId;
    });
  }
  async remove(id: number) {
    return this.prismaService.$transaction(async (prismaClient) => {
      const existing = await prismaClient.saleInvoice.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new NotFoundException(`Invoice with id ${id} not found`);
      }

      await prismaClient.saleInvoiceItem.deleteMany({
        where: { saleInvoiceId: id },
      });

      await prismaClient.saleInvoice.delete({
        where: { id },
      });

      return id;
    });
  }
}
