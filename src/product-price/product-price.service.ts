import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductPurchasePrice } from '@prisma/client';
import { ProductDto } from '../invoice/purchase-invoice/dto/create-purchase-invoice.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductPriceService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkUpsertPrices(
    prismaTransaction: Prisma.TransactionClient,
    products: ProductDto[],
  ): Promise<void> {
    for (const product of products) {
      await prismaTransaction.productPurchasePrice.updateMany({
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

    await prismaTransaction.productPurchasePrice.createMany({
      data: products.map((p) => ({
        productId: p.productId,
        unitId: p.unitId,
        purchasePrice: p.price,
        effectiveDate: new Date(),
      })),
    });
  }

  async findLatestPrice(
    prismaTransaction: Prisma.TransactionClient,
    productId: number,
    unitId: number,
  ): Promise<ProductPurchasePrice> {
    const price = await prismaTransaction.productPurchasePrice.findFirst({
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
