import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ProductPurchasePrice } from '@prisma/client';
import { CreateProductSalePriceDto } from '../dto/create-product-sale-price.dto';

@Injectable()
export class ProductPriceService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchasePrice(
    productId: number,
    unitId: number,
    purchasePrice: number,
    prismaTransaction?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTransaction || this.prisma;

    return prismaClient.productPurchasePrice.create({
      data: {
        productId,
        unitId,
        price: purchasePrice,
        effectiveDate: new Date(),
      },
    });
  }

  async findLatestPurchasePrice(
    productId: number,
    unitId: number,
    prismaTransaction?: Prisma.TransactionClient,
  ): Promise<ProductPurchasePrice> {
    const prismaClient = prismaTransaction || this.prisma;

    const purchasePrice = await prismaClient.productPurchasePrice.findFirst({
      where: { productId, unitId },
      orderBy: { effectiveDate: 'desc' },
    });

    if (!purchasePrice) {
      throw new NotFoundException(
        `No purchase price found for productId: ${productId}, unitId: ${unitId}`,
      );
    }

    return purchasePrice;
  }

  async createSalePrice(
    productId: number,
    unitId: number,
    sellingPrice: number,
    prismaTransaction?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTransaction || this.prisma;

    return prismaClient.productSalePrice.create({
      data: {
        productId,
        unitId,
        price: sellingPrice,
        effectiveDate: new Date(),
      },
    });
  }

  async getProductFromSellingPrice(
    productId: number,
    unitId: number,
    prismaTransaction?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTransaction || this.prisma;

    return prismaClient.productSalePrice.findFirst({
      where: { productId, unitId },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async setSalePrice(
    productId: number,
    createProductSalePriceDto: CreateProductSalePriceDto,
  ) {
    const { unitId, sellingPrice } = createProductSalePriceDto;

    await this.validateProductAndUnitExistence(productId, unitId);

    return this.prisma.productSalePrice.create({
      data: {
        price: sellingPrice,
        productId,
        unitId,
        effectiveDate: new Date(),
      },
    });
  }

  async getSalePriceHistory(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        baseUnit: true,
        productSalePrices: {
          include: {
            unit: true,
          },
        },
        productUnits: {
          include: {
            unit: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    const unitsMap = new Map();

    product.productUnits.forEach((productUnit) => {
      unitsMap.set(productUnit.unit.id, {
        id: productUnit.unit.id,
        unitName: productUnit.unit.unitName,
        unitSymbol: productUnit.unit.unitSymbol,
        createdAt: productUnit.unit.createdAt,
        updatedAt: productUnit.unit.updatedAt,
        prices: [],
        activePrice: null,
      });
    });

    product.productSalePrices.forEach((salePrice) => {
      if (unitsMap.has(salePrice.unitId)) {
        unitsMap.get(salePrice.unitId).prices.push({
          id: salePrice.id,
          price: salePrice.price,
          effectiveDate: salePrice.effectiveDate,
        });
      }
    });

    unitsMap.forEach((unit) => {
      unit.prices.sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime(),
      );
      if (unit.prices.length > 0) {
        unit.activePrice = unit.prices[0];
      }
    });

    const {
      categoryId,
      baseUnitId,
      productSalePrices,
      productUnits,
      ...productData
    } = product;

    return {
      ...productData,
      units: Array.from(unitsMap.values()),
    };
  }

  private async validateProductAndUnitExistence(
    productId: number,
    unitId: number,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    const unit = await this.prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) {
      throw new NotFoundException(`Unit with ID ${unitId} not found.`);
    }
  }
}
