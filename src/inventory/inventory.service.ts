import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async increaseInventory(
    prismaTransaction: Prisma.TransactionClient,
    productId: number,
    quantity: number,
  ) {
    await prismaTransaction.inventory.upsert({
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
    prismaTransaction: Prisma.TransactionClient,
    productId: number,
    quantity: number,
  ) {
    await prismaTransaction.inventory.update({
      where: { productId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }
}
