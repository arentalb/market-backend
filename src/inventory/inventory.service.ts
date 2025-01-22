import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UnitConversionService } from '../units/unit-conversion.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly unitConversionService: UnitConversionService,
  ) {}

  async increaseInventory(
    productId: number,
    quantity: number,
    prismaTransaction?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTransaction || this.prismaService;

    console.log('----------------------');
    console.log('productId', productId);
    console.log('quantity', quantity);
    const data = await prismaClient.inventory.upsert({
      where: { productId },
      create: {
        productId,
        quantity,
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }
  async decreaseInventory(
    productId: number,
    quantity: number,
    prismaTransaction?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTransaction || this.prismaService;

    await prismaClient.inventory.update({
      where: { productId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  async getInventoryDetail(name: string) {
    const inventory = await this.prismaService.inventory.findMany({
      where: {
        ...(name && {
          product: {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
        }),
      },
      include: {
        product: {
          include: {
            baseUnit: true,
            productUnits: {
              include: {
                unit: true,
              },
            },
          },
        },
      },
    });

    const data = await Promise.all(
      inventory.map(async (inventoryItem) => {
        const quantityInUnits = await Promise.all(
          inventoryItem.product.productUnits.map(async (productUnit) => {
            const convertedQuantity =
              await this.unitConversionService.calculateQuantityInBaseUnit(
                productUnit.unitId,
                inventoryItem.product.baseUnitId,
                Number(inventoryItem.quantity),
              );
            return {
              unit: productUnit.unit.unitSymbol,
              quantity: convertedQuantity,
            };
          }),
        );

        return {
          id: inventoryItem.product.id,
          name: inventoryItem.product.name,
          quantityInUnits,
        };
      }),
    );

    return data;
  }
}
