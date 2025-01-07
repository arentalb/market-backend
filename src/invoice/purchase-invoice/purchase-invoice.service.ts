import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePurchaseInvoiceDto,
  ProductDto,
} from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PurchaseInvoiceService {
  constructor(private prisma: PrismaService) {}
  async create(
    createPurchaseInvoiceDto: CreatePurchaseInvoiceDto,
    userId: number,
  ) {
    const { products, supplierId } = createPurchaseInvoiceDto;

    return this.prisma.$transaction(async (prisma) => {
      const invoice = await this.createInvoice(prisma, supplierId, userId);
      await this.addProductPurchasePrices(prisma, products);
      await this.processProductInventory(prisma, products, invoice.id);
      return invoice;
    });
  }

  findAll() {
    return `This action returns all purchaseInvoice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseInvoice`;
  }

  update(id: number, updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto) {
    return `This action updates a #${id} purchaseInvoice`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseInvoice`;
  }

  private async createInvoice(
    prisma: Prisma.TransactionClient,
    supplierId: number,
    userId: number,
  ) {
    return prisma.purchaseInvoice.create({
      data: {
        supplierId,
        workerId: userId,
        date: new Date(),
      },
    });
  }

  private async addProductPurchasePrices(
    prisma: Prisma.TransactionClient,
    products: ProductDto[],
  ) {
    const productPurchasePrices = products.map((product) => ({
      productId: product.productId,
      purchasePrice: product.price,
      unitId: product.unitId,
      effectiveDate: new Date(),
    }));

    await prisma.productPurchasePrice.createMany({
      data: productPurchasePrices,
    });
  }

  private async processProductInventory(
    prisma: Prisma.TransactionClient,
    products: ProductDto[],
    invoiceId: number,
  ) {
    for (const product of products) {
      const productPurchasePrice = await this.findLatestProductPurchasePrice(
        prisma,
        product,
      );
      const productDetails = await this.findProductDetails(
        prisma,
        product.productId,
      );
      const baseUnitQuantity = await this.calculateBaseUnitQuantity(
        prisma,
        product,
        productDetails,
      );

      await prisma.purchaseInvoiceItem.create({
        data: {
          purchaseInvoiceId: invoiceId,
          productPurchasePriceId: productPurchasePrice.id,
          quantity: product.quantity,
        },
      });

      await this.updateInventory(prisma, product.productId, baseUnitQuantity);
    }
  }

  private async findLatestProductPurchasePrice(
    prisma: Prisma.TransactionClient,
    product,
  ) {
    const productPurchasePrice = await prisma.productPurchasePrice.findFirst({
      where: { productId: product.productId, unitId: product.unitId },
      orderBy: { effectiveDate: 'desc' },
    });

    if (!productPurchasePrice) {
      throw new NotFoundException(
        `Purchase price for product ${product.productId} not found`,
      );
    }

    return productPurchasePrice;
  }

  private async findProductDetails(
    prisma: Prisma.TransactionClient,
    productId: number,
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    return product;
  }

  private async calculateBaseUnitQuantity(
    prisma: Prisma.TransactionClient,
    product,
    productDetails,
  ) {
    const unitConversion = await prisma.unitConversion.findFirst({
      where: {
        OR: [
          { fromUnitId: product.unitId, toUnitId: productDetails.baseUnitId },
          { fromUnitId: productDetails.baseUnitId, toUnitId: product.unitId },
        ],
      },
    });

    if (!unitConversion) {
      throw new NotFoundException(
        `Conversion for product ${product.productId} not found`,
      );
    }

    return product.quantity * unitConversion.conversionRate.toNumber();
  }

  private async updateInventory(
    prisma: Prisma.TransactionClient,
    productId: number,
    baseUnitQuantity: number,
  ) {
    await prisma.inventory.upsert({
      where: { id: productId },
      update: { quantity: { increment: baseUnitQuantity } },
      create: { productId, quantity: baseUnitQuantity },
    });
  }
}
// private async convertToBaseUnit(
//   productId: number,
//   quantity: number,
//   unitId: number,
// ): Promise<number> {
//   const unitConversion = await this.prisma.unitConversion.findFirst({
//     where: {
//       productId: productId,
//       unitId: unitId,
//     },
//   });
//
//   if (!unitConversion) {
//     throw new NotFoundException(
//       `Conversion for product ${productId} and unit ${unitId} not found`,
//     );
//   }
//
//   return quantity * unitConversion.conversionFactor;
// }
