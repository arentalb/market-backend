import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProductPurchasePrice } from '@prisma/client';
import { ProductDto } from '../invoice/purchase-invoice/dto/create-purchase-invoice.dto';

@Injectable()
export class ProductPriceService {
  constructor(private readonly prismaService: PrismaService) {}

  async bulkUpsertPrices(
    products: ProductDto[],
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<void> {
    const prismaClient = prismaTransaction || this.prismaService;

    for (const product of products) {
      await prismaClient.productPurchasePrice.updateMany({
        where: {
          productId: product.productId,
          unitId: product.unitId,
        },
        data: {
          purchasePrice: product.price,
          effectiveDate: new Date(),
        },
      });
    }

    await prismaClient.productPurchasePrice.createMany({
      data: products.map((p) => ({
        productId: p.productId,
        unitId: p.unitId,
        purchasePrice: p.price,
        effectiveDate: new Date(),
      })),
    });
  }

  async findLatestPrice(
    productId: number,
    unitId: number,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<ProductPurchasePrice> {
    const prismaClient = prismaTransaction || this.prismaService;

    const price = await prismaClient.productPurchasePrice.findFirst({
      where: {
        productId,
        unitId,
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    if (!price) {
      throw new NotFoundException(
        `No purchase price found for productId: ${productId}, unitId: ${unitId}`,
      );
    }

    return price;
  }
}
