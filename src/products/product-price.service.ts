import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, ProductPurchasePrice } from '@prisma/client';

@Injectable()
export class ProductPriceService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPurchasePrice(
    productId: number,
    unitId: number,
    purchasePrice: number,
    prismaTransaction?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTransaction || this.prismaService;

    return prismaClient.productPurchasePrice.create({
      data: {
        productId,
        unitId,
        purchasePrice,
        effectiveDate: new Date(),
      },
    });
  }

  async findLatestPurchasePrice(
    productId: number,
    unitId: number,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<ProductPurchasePrice> {
    const prismaClient = prismaTransaction || this.prismaService;

    const purchasePrice = await prismaClient.productPurchasePrice.findFirst({
      where: {
        productId,
        unitId,
      },
      orderBy: {
        effectiveDate: 'desc',
      },
    });

    if (!purchasePrice) {
      throw new NotFoundException(
        `No purchase price found for productId: ${productId}, unitId: ${unitId}`,
      );
    }

    return purchasePrice;
  }
}
