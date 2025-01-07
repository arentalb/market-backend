import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async increaseInventory(
    productId: number,
    quantity: number,
    prismaTransaction?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTransaction || this.prismaService;

    await prismaClient.inventory.upsert({
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
}
